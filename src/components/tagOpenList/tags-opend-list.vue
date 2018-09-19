<template>
  <div ref="scrollCon" @DOMMouseScroll="handleScroll" @mousewheel="handleScroll" class="tags-outer-scroll-con"
       @touchstart="touchstart"
       @touchmove="touchmove"
       @touchend="touchend">
    <div class="close-all-tag-con">
      <Dropdown transfer @on-click="handleTagsOption" trigger="click">
        <Button size="small" type="primary">
          标签选项
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="clearAll">关闭所有</DropdownItem>
          <DropdownItem name="clearOthers">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
      <transition-group name="taglist-moving-animation">
        <Tag
          type="dot"
          v-for="(item) in pageList"
          ref="tagsPageOpened"
          :key="item.name"
          :name="item.name"
          @on-close="closePage"
          @click.native="linKTo(item)"
          :closable="item.name === 'home_index'?false:true"
          :color = "item.name === currentPageName?'blue':'default'"
          @autoShowTag="autoshowShowTag(item)"
        >{{ item.title }}</Tag>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tags-opend-list',
  inject: ['reload'],
  data () {
    return {
      tagBodyLeft: 0,
      refsTag: [],
      tagsCount: 1,
      basicData: {
        start: {}
      },
      templateData: {
        poswidth: 0
      }
    }
  },
  watch: {
    '$route' (to) {
      this.refsTag = this.$refs.tagsPageOpened
      this.$nextTick(() => {
        this.refsTag.forEach((item, index) => {
          if (this.$route.name === item.name) {
            let tag = this.$refs.tagsPageOpened[index].$el
            this.moveToView(tag)
          }
        })
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.refsTag = this.$refs.tagsPageOpened
      this.refsTag.forEach((item, index) => {
        if (this.$route.name === item.name) {
          let tag = this.refsTag[index].$el
          this.moveToView(tag)
        }
      })
    })
  },
  props: {
    pageList: Array,
    beforePush: {
      type: Function,
      default: (item) => {
        return true
      }
    }
  },
  computed: {
    title () {
      return this.$store.state.currentTitle
    },
    tageList () {
      return this.$store.state.pageOpenedList
    },
    currentPageName () {
      return this.$route.name
    }

  },
  methods: {
    handleTagsOption (type) {
      if (type === 'clearAll') {
        this.$store.commit('clearAllTags')
        this.$router.push({name: 'home_index'})
      } else {
        this.$store.commit('clearOtherTags', this)
      }
    },
    linKTo (item) {
      if (item.name === '手动封停管理') {
        this.reload()
      }
      let routerObj = {}
      routerObj.name = item.name
      if (item.argu) {
        routerObj.params = item.argu
      }
      if (item.query) {
        routerObj.query = item.query
      }
      if (this.beforePush(item)) {
        this.$router.push(routerObj)
      }
    },
    closePage (event, name) {
      let pageOpenList = this.$store.state.pageOpenList
      let lastPageObj = pageOpenList[0]
      if (this.currentPageName === name) {
        for (let i = 0; i < pageOpenList.length; i++) {
          if (pageOpenList[i].name === name) {
            if (i < pageOpenList.length - 1) {
              lastPageObj = pageOpenList[i + 1]
            } else {
              lastPageObj = pageOpenList[i - 1]
            }
            break
          }
        }
      } else {
        let tagWidth = event.target.parentNode.offsetWidth
        this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0)
      }
      this.$store.commit('removeTag', name)
      pageOpenList = this.$store.state.pageOpenList
      localStorage.pageOpenList = JSON.stringify(pageOpenList)
      if (this.currentPageName === name) {
        this.linKTo(lastPageObj)
      }
    },
    handleScroll (e) {
      let type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
        let left = 0
        if (delta > 0) {
          left = Math.min(0, this.tagBodyLeft + delta)
        } else {
          if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
            if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
              left = this.tagBodyLeft
            } else {
              left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100)
            }
          } else {
            this.tagBodyLeft = 0
          }
        }
        this.tagBodyLeft = left
      }
    },
    touchstart (e) {
      if (e.type === 'touchstart') {
        this.basicData.start.x = e.targetTouches[0].clientX
      }
    },
    touchmove (e) {
      if (e.type === 'touchmove') {
        this.templateData.poswidth = e.targetTouches[0].clientX
      }
    },
    touchend (e) {
      let left = 0
      let lastPosWidth = Math.abs(this.templateData.poswidth) - this.basicData.start.x
      let posOffset = this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth
      console.log(lastPosWidth)
      if (this.templateData.poswidth === 0 || Math.abs(lastPosWidth) < 50) {
        return
      }
      if (e.type === 'touchend') {
        if (lastPosWidth > 0) {
          left = Math.min(0, -this.tagBodyLeft)
        } else {
          if (posOffset + 100 > 0) {
            if (posOffset < Math.abs(this.tagBodyLeft + lastPosWidth)) {
              left = -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)
            } else {
              left = (lastPosWidth + this.tagBodyLeft)
            }
          }
        }
      }
      this.tagBodyLeft = left
    },
    moveToView (tag) {
      if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + 10
      } else if (tag.offsetLeft + 10 > this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20)
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 15)
      }
    }
  }
}
</script>

<style scoped>
  .tags-outer-scroll-con{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  .tags-outer-scroll-con .close-all-tag-con{
    position: absolute;
    top: 0;
    right: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 8px;
    text-align: center;
    width: 110px;
    height: 100%;
    background: white;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  .tags-outer-scroll-con .tags-inner-scroll-body{
    position: absolute;
    padding: 2px 10px;
    overflow: visible;
    white-space: nowrap;
    transition: left .3s ease;
  }
  .taglist-moving-animation-move{
    transition: transform .3s;
  }
  @media screen and (max-width: 768px) {
    .tags-outer-scroll-con .close-all-tag-con{
      right: 0;
    }
  }
</style>
<style>
  .ivu-tag-text{
    font-size: 12px;
  }
</style>
