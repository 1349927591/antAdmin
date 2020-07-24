<!-- 数字滚动卡 -->
<template>
  <div class="value" :style="backgroundStyle">
    <svg width="266px" height="140px" viewBox="0 0 266 140" version="1.1" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink" class="value-background" ref="svg">
        <defs>
            <linearGradient x1="99.4457348%" y1="63.6968794%" x2="0%" y2="36.1495845%" :id="'linearGradient-'+color">
                <stop :stop-color="colors[0]" offset="0%"></stop>
                <stop :stop-color="colors[1]" offset="100%"></stop>
            </linearGradient>
            <rect id="path-2" x="0" y="0" width="266" height="140" rx="8"></rect>
            <linearGradient x1="50%" y1="0.337837838%" x2="50%" y2="100%" id="linearGradient-br">
                <stop stop-color="#FFFFFF" stop-opacity="0.08" offset="0%"></stop>
                <stop stop-color="#FFFFFF" stop-opacity="0.06" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="50%" y1="0.947529561%" x2="50%" y2="100%" id="linearGradient-right">
                <stop stop-color="#FFFFFF" stop-opacity="0.1" offset="0%"></stop>
                <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"></stop>
            </linearGradient>
            <circle id="path-6" cx="22" cy="22" r="22"></circle>
        </defs>
        <g id="后台" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="1_1-首页" transform="translate(-496.000000, -116.000000)">
                <g id="4块2" transform="translate(206.000000, 116.000000)">
                    <g id="4块备份-2" transform="translate(290.000000, 0.000000)">
                        <g id="编组-2">
                            <g id="编组-11">
                                <g id="路径-2">
                                    <mask id="mask-3" fill="white">
                                        <use xlink:href="#path-2"></use>
                                    </mask>
                                    <use id="蒙版" :fill="'url(#linearGradient-'+color+')'" xlink:href="#path-2"></use>
                                    <polygon fill="url(#linearGradient-br)" mask="url(#mask-3)" points="33 167.5 299.5 -12 -28 -2 -28 172"></polygon>
                                </g>
                                <path d="M151,0 L257.646704,0 C262.064982,-8.11624501e-16 265.646704,3.581722 265.646704,8 L265.646704,129.671468 C265.646704,135.375759 261.022462,140 255.318172,140 L151,140 L151,0 Z" id="矩形备份" fill="url(#linearGradient-right)"></path>
                                <g id="编组-9" transform="translate(188.000000, 48.000000)">
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
    <div class="value-main">
      <div class="value-text">
        <div class="value-content">
          <div class="value-val">{{showVal}}</div>
          <div class="value-unit" :style="descStyle">{{unit}}</div>
        </div>
        <div class="value-desc" :style="descStyle">{{desc}}</div>
      </div>
      <div class="value-icon">
        <div class="value-icon-back" :style="iconStyle">
          <a-icon :type="icon" v-if="icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemNumberCard',
  props: {
    desc: { // 备注
      type: String,
      default: ''
    },
    unit: { // 备注
      type: String,
      default: ''
    },
    icon: { // 备注
      type: String,
      default: ''
    },
    decimal: {
      type: Number,
      default: 0
    },
    value: {
      default: 0
    },
    color: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      val: 0,
      showVal: 0,
      modelVal: 0
    }
  },
  watch: {
    value: function () {
      this.val = 0
      this.showVal = 0
      if (this.value > 0) {
        this.doUpdate()
      }
    }
  },
  computed: {
    colors: function () {
      switch (this.color) {
        case 1:
          return ['#59D8BA', '#13B18D']
        case 2:
          return ['#FDC459', '#FF8A00']
        case 3:
          return ['#8982FF', '#7870FF']
        case 4:
          return ['#49A7FC', '#546EFF']
        case 5:
          return ['#FEB692', '#EA5455']
      }
    },
    iconStyle: function () {
      switch (this.color) {
        case 1:
          return 'color: #13B18D;'
        case 2:
          return 'color: #FF8A00;'
        case 3:
          return 'color: #7870FF;'
        case 4:
          return 'color: #546EFF;'
        case 5:
          return 'color: #EA5455;'
      }
    },
    descStyle: function () {
      return 'color:#f8f8f8'
    }
  },
  mounted () {
    this.val = 0
    this.showVal = 0
    if (this.value > 0) {
      this.doUpdate()
    }
  },
  methods: {
    doUpdate () {
      setTimeout(() => {
        const val = Number(this.value)
        let minValue = 1 / Math.pow(10, this.decimal)
        let addValue = val / 200
        if (addValue < minValue) {
          addValue = minValue
        }
        let newValue = parseFloat(this.val) + addValue
        newValue = newValue.toFixed(this.decimal)
        if (newValue > val) {
          newValue = val
        }
        this.val = newValue
        this.showVal = this.valForm(this.val)
        if (val > this.val) {
          this.doUpdate()
        }
      }, 10)
    },
    valForm (val) {
      if (val > 100000000) {
        return (val / 100000000).toFixed(2) + '亿'
      } else if (val > 100000) {
        return (val / 10000).toFixed(2) + '万'
      }
      return val
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('SystemNumberCard.less');
</style>
