<template>
  <el-card class="test-card">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
      <el-button @click="update" style="float: right; padding: 3px 0" type="text">编辑</el-button>
    </div>
    <div class="card-body">
      <div class="download-module" v-if="moduleMap.download">
        <el-progress type="circle" :width="90" :percentage="CProgress"></el-progress>
      </div>
      <div class="ping-module" v-if="moduleMap.ping">
          ping值：{{CArvPing}}
      </div>
      <div class="info-panel">
        <h3>
          文件总大小：{{CFileSize}}
        </h3>
        <h3>
          最大下载速度：{{CMaxSpeed}}
        </h3>
        <h3>
          最小下载速度：{{CMinSpeed}}
        </h3>
        <h3>
          平均下载速度：{{CArvSpeed}}
        </h3>
        <h3>
          平均ping值：{{CArvPing}}
        </h3>
      </div>
      <el-button :type="CButtonType"
                 :loading="CButtonDisable"
                 :disabled="CButtonDisable"
                 @click="action" round>{{CButtonText}}</el-button>
    </div>
  </el-card>
</template>

<script>
  import Chart from 'chart.js'
  import EventBus from "@/utils/eventBus"

  //url混淆
  function hashUrl(url) {
      return (/\?/.test(url))
        ? url + new Date().getTime()
        : url + '?' + new Date().getTime();
  }

  //ajax 对象
  function XHRObject() {
    let xmlHttp;
    try {
      xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
      // Internet Explorer
      try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          console.log("report failure!");
          return false;
        }
      }
    }
    return xmlHttp;
  }


  // 获取一组数据的平均值
  function getArv(arr) {
    let sum = eval(arr.join("+"));
    return sum / arr.length;
  }

  //unit: MBS, KBS, BS, MBMS, KBMS, BMS
  function getBitSpeed(bitData,timeData,unit = 'KBS') {
      let str = 0;
      switch (unit){
        case 'MBS':  str = (bitData / 1024 /1024 ) / (timeData /1000); break;
        case 'KBS':  str = (bitData / 1024) / (timeData /1000); break;
        case 'BS':   str = (bitData) / (timeData /1000); break;
        case 'MBMS': str = (bitData / 1024 /1024 ) / (timeData); break;
        case 'KBMS': str = (bitData / 1024) / (timeData ); break;
        case 'BMS':  str = (bitData) / (timeData ); break;
      }
      return str.toFixed(2) + unit;
  }




  export default {
    name: 'TestCard',
    props: {
      //组件所在的下标
      index: {
        type: Number,
        required: true,
      },
      moduleMap: {
        type: Object,
        require:true,
      },
      //采样时间间隔，单位接受s,ms最小不超过100
      interval: {
        type: Number,
        required: false,
        default: 1000,
        validator: function (value) {
          return value >= 100;
        }
      },
      //对数据结果进行上报的url,如果为空，则表示默认不进行上报
      postUrl: {
        type: String,
        required: false,
        default: '',
      },
      title: {
        type: String,
        required: false,
        default: '新建测试',
      }
    },

    data () {
      return {
        //下载xhr对象:
        downloadXHR: null,
        //下载最大速度
        downloadMaxSpeed: 0,
        //下载最小速度
        downloadMinSpeed: 0,
        //下载平均速度
        downloadArvSpeed: 0,
        //下载采样集合
        downloadSpeedArr: [],
        //下载文件大小
        fileSize: 0,
        //已下载文件大小
        fileLoaded: 0,
        //ping采样集合
        pingArr: [],
        postData: {
          "maxspeed":"'+lmaxSpeed+'kb/s",
          "minspeed":"'+lminSpeed+'kb/s",
          "arvspeed":"'+larvSpeed+'kb/s",
          "arvResTime":"'+arvResTime+',",
          "namelog": "download",
          "type": "velia"
        },

        ButtonStatus: "start",  //start, ing, restart
        ButtonDisable: false,  //loading,
        xhr: null   //当前的xhr传输对象
      }
    },
    mounted (){
      //this.data
    },
    computed: {
      CProgress () {
        if(this.fileLoaded === 0||this.fileSize === 0)
          return 0;
        return Number(((this.fileLoaded/this.fileSize) * 100).toFixed(2))
      },
      CFileSize () {
        if(this.fileSize) {
          return (this.fileSize / 1024 / 1024) + 'M';
        }
        return '未知'
      },
      CMaxSpeed () {
          return this.downloadMaxSpeed
          ? getBitSpeed(this.downloadMaxSpeed, this.interval)
          : '未知'
      },
      CMinSpeed () {
        return this.downloadMinSpeed !== 0
          ? getBitSpeed(this.downloadMinSpeed, this.interval)
          : '未知'
      },
      CArvSpeed () {
        return this.downloadSpeedArr.length > 0
          ? getBitSpeed(getArv(this.downloadSpeedArr), this.interval)
          : '未知'
      },
      CArvPing () {
        return this.pingArr.length > 0
          ? getArv(this.pingArr).toFixed(2) + 'ms'
          : '未知'
      },

      CButtonType () {
        if(this.ButtonStatus === 'start')
          return 'primary'
        if(this.ButtonStatus === 'ing')
          return 'danger'
        if(this.ButtonStatus === 'restart')
          return 'success'
      },
      CButtonText () {
        if(this.ButtonStatus === 'start')
          return '开始'
        if(this.ButtonStatus === 'ing')
          return '终止'
        if(this.ButtonStatus === 'restart')
          return '重新测试'
      },
      CButtonDisable () {
        return this.ButtonDisable
      }
    },
    methods: {
      testDownload () {
        if(this.ButtonStatus === 'ing') {
          this.xhr.abort()
          this.ButtonDisable = false
          this.ButtonStatus = 'restart'
          return
        }

        this.xhr = new XHRObject();
        let xhr =  this.xhr
        let lastLoaded = 0;
        let lastSpeed = 0
        let timer = null

          xhr.open("GET", hashUrl(this.moduleMap.download.url), true)
          xhr.responseType = "text"

          let handle = (e) => {
            this.fileLoaded = e.loaded;
            if(this.fileSize === 0 && e.total !== 0)
              this.fileSize = e.total;
            lastSpeed =  e.loaded - lastLoaded;
            lastLoaded = e.loaded;

            this.downloadSpeedArr.push(lastSpeed)

            if(lastSpeed > this.downloadMaxSpeed)
              this.downloadMaxSpeed = lastSpeed

            if(this.downloadMinSpeed === 0){
              this.downloadMinSpeed = lastSpeed
            }else{
              if(lastSpeed < this.downloadMinSpeed && lastSpeed !== 0)
                this.downloadMinSpeed = lastSpeed
            }
          }

          xhr.onprogress = (e)=> {
            //设置最小间隔时间
            if(timer !== null)
              return ;
            else{
              timer = setTimeout(function(){
                window.clearTimeout(timer);
                timer = null;
              },this.interval);
            }
            this.testPing();
            handle(e)
          };

          xhr.onloadstart = (e) => {
            handle(e)
            this.ButtonDisable = false
            this.ButtonStatus = 'ing'
          };

          xhr.onloadend = (e) => {
            handle(e)
            this.ButtonStatus = 'restart'
          };
          xhr.send(null);
      },
      testPing() {
        let xhr = XHRObject();
        let startTime = 0
        let endTime = 0

        xhr.open("GET", hashUrl(this.moduleMap.ping.url), true)
        xhr.responseType = "text";

        xhr.onloadstart = function(e) {
          startTime = e.timeStamp
        };

        xhr.onreadystatechange = (e)=> {
          if(xhr.readyState === 2){
            endTime = e.timeStamp;
            this.pingArr.push(endTime - startTime);
          }
        }
        xhr.send(null);
      },
      update() {
        EventBus.emit('updateTest', this.index)
      },
      action(){
        this.ButtonDisable = true;
        this.testDownload();
      }
    }
  }
</script>

<style lang="scss">
  .card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .info-panel {
      margin: 10px 0;
      width: 100%;

      h3 {
        font-size:14px;
        font-weight: bold;
        width: 100%;
        margin-bottom: 10px;
      }
    }

  }
</style>
