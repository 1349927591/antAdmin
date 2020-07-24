<template>
  <div class="exception">
    <div class="img">
      <img :src="img" />
      <!--<div class="ele" :style="{backgroundImage: `url(${config[type].img})`}"/>-->
    </div>
    <div class="content">
      <h1>{{title}}</h1>
      <div class="desc">{{desc}}</div>
    </div>
  </div>
</template>

<script>
const config = {
  403: {
    img: 'static/img/error/403.svg',
    title: '403',
    desc: '抱歉，你无权访问该页面'
  },
  404: {
    img: 'static/img/error/404.svg',
    title: '404',
    desc: '抱歉，你访问的页面不存在或仍在开发中'
  },
  500: {
    img: 'static/img/error/500.svg',
    title: '500',
    desc: '抱歉，服务器出错了'
  }
}

export default {
  name: 'ExceptionPage',
  data () {
    return {
      img: '',
      title: '',
      desc: ''
    }
  },
  mounted () {
    const type = this.$route.query.type || 500
    this.img = config[type].img
    this.title = config[type].title
    this.desc = config[type].desc
  }
}
</script>

<style lang="less" scoped>
  .exception{
    min-height: 500px;
    height: 80%;
    align-items: center;
    text-align: center;
    margin-top: 150px;
    .img{
      display: inline-block;
      padding-right: 52px;
      zoom: 1;
      img{
        height: 360px;
        max-width: 430px;
      }
    }
    .content{
      display: inline-block;
      flex: auto;
      h1{
        color: #434e59;
        font-size: 72px;
        font-weight: 600;
        line-height: 72px;
        margin-bottom: 24px;
      }
      .desc{
        color: rgba(0,0,0,.45);
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
      }
    }
  }

</style>
