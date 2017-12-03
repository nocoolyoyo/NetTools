<template>
    <div class="hello">
      <progress id="progress" value="0"></progress>
      <button id="button">Start download</button>totoal size:(2M)
      <span id="display"></span>
      <div id="maxSpeed"></div>
      <div id="minSpeed"></div>
      <div id="arvSpeed"></div>
      <div id="arvPing"></div>
      <!--<div>-->
      <!--<button id="testResponse">测试获取相应时间</button>-->
      <!--<span id="responseTime"></span>-->
      <!--</div>-->
      <div id="alert" style="display:none;position: fixed;top:0;width: 100vw;height:100vh;z-index:3;align-items: center;justify-content: center;">
        <div class="msg-box" style="border:1px solid gray; background-color: white;width:300px;min-height:200px;border-radius:15px;position: relative;" >
          <div style="margin: 40px auto;font-size: 16px;font-weight: bold;text-align: center" class="msg"></div>
          <button onclick=" closeAlert()" style="position: absolute;bottom: 20px;right:20px;">关闭</button>
        </div>
      </div>
    </div>
</template>

<script>
//  var url = 'http://onemttest.onemt.co/downtest.php?v=';
//  var testUrl = 'http://onemttest.onemt.co/ping.php?v=';
//  var progressBar = document.getElementById("progress");
//  var loadBtn = document.getElementById("button");
//  var display = document.getElementById("display");
//  var maxSpeed = document.getElementById("maxSpeed");
//  var minSpeed = document.getElementById("minSpeed");
//  var arvSpeed = document.getElementById("arvSpeed");
//  var timestamp = Date.parse(new Date());
//  var speedArr = [];
//  var resTimeArr = [];
//  var arvResTime = 0;
//
//  var sum = 0;
//  var lastload = 0;
//  var lasttime = 0;//上次统计的时间戳
//  var speed = 0;
//  var lmaxSpeed = 0;
//  var lminSpeed = 0;
//  var larvSpeed = 0;
//  var totalsize = 2*1024*1024;
//  function upload() {
//    var xhr = new XMLHttpRequest();
//    xhr.open("GET",url+Date.parse(new Date()), true);
//    xhr.responseType = "text";
//    var timer = null;
//    xhr.onprogress = function(e) {
//
//      //设置最小间隔时间
//      if(timer !== null)
//        return ;
//      else{
//        timer = setTimeout(function(){
//          window.clearTimeout(timer);
//          timer = null;
//        },300);
//      }
//      //这里测试相应时间
//      testResponse();
//      //console.log(e)
//      progressBar.max = totalsize;
//      progressBar.value = e.loaded;
//      if(lastload != 0 && lasttime!=0){
//        var nowloaded = e.loaded - lastload;
//        var time =  e.timeStamp - lasttime;
//        var speed = nowloaded*1000/time;
//        speedArr.push(speed)
//        // 最大值
//        function getMax(speedArr) {
//          return Math.max.apply(null, speedArr);
//        }
//        // 最小值
//        function getMin(speedArr) {
//          return Math.min.apply(null, speedArr);
//        }
//        // 平均值
//        function getArv(speedArr) {
//          var sum = eval(speedArr.join("+"));
//          return (sum / speedArr.length * 100) / 100;
//        }
//        lmaxSpeed = (getMax(speedArr) / 1024).toFixed(2);
//        lminSpeed = (getMin(speedArr) / 1024).toFixed(2);
//        larvSpeed = (getArv(speedArr) / 1024).toFixed(2);
//
//        maxSpeed.innerText = 'max speed：' + lmaxSpeed + 'kb/s';
//        minSpeed.innerText = 'min speed：' + lminSpeed + 'kb/s';
//        arvSpeed.innerText = 'average speed：' + larvSpeed + 'kb/s';
//
//
//
//        lastload = e.loaded;
//        lasttime = e.timeStamp;
//      }
//      lastload = e.loaded;
//      lasttime = e.timeStamp;
//    };
//    xhr.onloadstart = function(e) {
//      progressBar.value = 0;
//    };
//    xhr.onloadend = function(e) {
//      arvResTime =  getResponseEval();
//      var obj = '{"maxspeed":"'+lmaxSpeed+'kb/s","minspeed":"'+lminSpeed+'kb/s","arvspeed":"'+larvSpeed+'kb/s","arvResTime":"'+arvResTime+',"namelog":"download","type":"velia"}';
//      ajaxPost('./accept.php',obj);
//      document.getElementById("button").disabled = false;
//      document.getElementById("button").innerHTML = "Start download";
//      speedArr = [];
//      sum = 0;
//      lastload = 0;
//      lasttime = 0;
//      speed = 0;
//      lmaxSpeed = 0;
//      lminSpeed = 0;
//      larvSpeed = 0;
//
//      document.querySelector('#arvPing').innerText = 'average ping：' + arvResTime.toFixed(2) + 'ms';
//      timeArr = [];
//      _lasttime = 0;
//      progressBar.value = e.loaded;
//      AlertMsg();
//    };
//    xhr.send(null);
//  }
//  loadBtn.addEventListener("click", function(e) {
//    this.disabled = true;
//    this.innerHTML = "download...";
//    upload();
//  });
//  //ajax 对象
//  function ajaxObject() {
//    var xmlHttp;
//    try {
//      // Firefox, Opera 8.0+, Safari
//      xmlHttp = new XMLHttpRequest();
//    }
//    catch (e) {
//      // Internet Explorer
//      try {
//        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
//      } catch (e) {
//        try {
//          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
//        } catch (e) {
//          console.log("report failure!");
//          return false;
//        }
//      }
//    }
//    return xmlHttp;
//  }
//  // ajax post请求：
//  function ajaxPost (url ,data) {
//    var ajax = ajaxObject();
//    ajax.open( "get" , url , true );
//    ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded" );
//    ajax.onreadystatechange = function () {
//      if( ajax.readyState == 4 ) {
//        if( ajax.status == 200 )
//          console.log("report success!");
//        else
//          console.log("http error:"+ajax.status);
//      }
//    }
//    ajax.send(data);
//  }
//
//
//
//
//
//  //测试响应时间
//  function testResponse() {
//    var startTime = 0,endTime = 0;
//    var xhr = ajaxObject();
//    xhr.open("GET",testUrl + new Date().getTime(), true);
//    xhr.responseType = "text";
//    xhr.onloadstart = function(e) {
//      startTime = e.timeStamp
//    };
//    xhr.onreadystatechange = function (e) {
//      if(xhr.readyState === 2){
//        endTime = e.timeStamp;
//        console.log(endTime - startTime)
//        resTimeArr.push(endTime - startTime);
//      }
//    }
//    xhr.send(null);
//  }
//
//  //获取响应时间平均值
//  function getResponseEval() {
//    console.log(resTimeArr)
//    var sum = eval(resTimeArr.join("+"));
//    return (sum / resTimeArr.length);
//  }
//
//
//  function AlertMsg(){
//    var alertDom = document.querySelector('#alert');
//    alertDom.querySelector('.msg').innerText = "complete";
//    alertDom.style.display = 'flex';
//  }
//
//  function closeAlert() {
//    document.querySelector('#alert').style.display = 'none';
//  }

    export default {
        name: 'UploadTest',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>
<style scoped>

</style>
