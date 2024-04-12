<!-- 
  组件说明： 本组件为仪表盘页面右侧时钟组件。
-->
<template>
    <div class="time" id="timeBox">
        <div id="kd-box"></div>
        <div id="hour"></div>
        <div id="minute"></div>
        <div id="second"></div>
        <div id="round"></div>
    </div>
</template>
<style scoped>
    .time{height: 60px; width: 60px; position: fixed; right: 10px; top: 50%;transform: translateY(-50%); background: #3C3C3C; border-radius: 50%;box-shadow: 0 0 0 5px #3C3C3C;z-index: 1000;}
    #kd-box {width: 100%;height: 100%;position: absolute;left: 0;top: 0; }
    #hour,#minute,#second {position: absolute;height: 50%;background: #FFF;position: absolute;left: 50%;top: 0;transform-origin: left bottom;transform: rotate(10deg)}
    #hour {width: 2px;background: -webkit-linear-gradient(bottom,#FFF 0,#FFF 38%,rgba(0,0,0,0) 38%);}
    #minute {width: 1px;background: -webkit-linear-gradient(bottom,#FFF 0,#FFF 60%,rgba(0,0,0,0) 60%);}
    #second {width: 1px;background: -webkit-linear-gradient(bottom,#FE3163 0,#FE3163 85%,rgba(0,0,0,0) 85%);}
    #round {width: 10%;height: 10%;border-radius: 50%;background: #FFF;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%)}
    #kd-box >>> div {width: 2px;height: 50%;background: -webkit-linear-gradient(top,#8E8E8E 0,#8E8E8E 2%,rgba(0,0,0,0) 2%);position: absolute;left: 50%;top: 0;transform-origin: center bottom}
    #kd-box >>> .long {background: -webkit-linear-gradient(top,#8E8E8E 0,#8E8E8E 9%,rgba(0,0,0,0) 9%);}
</style>
<script>
    function fixedDoc() {
        document.documentElement.style.height = "100%";
        document.documentElement.style.overflow = "hidden";
    }
    function resetDoc() {
        document.documentElement.style.height = "auto";
        document.documentElement.style.overflow = "auto";
    }
    export default {
        data() {
            return {
                timer: ""
            }
        },
        methods: {
            getCurrentTime() {
                let d = new Date();
                let h = d.getHours();
                let m = d.getMinutes();
                let s = d.getSeconds();
                hour.style.transform = `rotate(${(h + m/60) * 30}deg)`;
                minute.style.transform = `rotate(${(m + s / 60) * 6}deg)`;
                second.style.transform = `rotate(${s * 6}deg)`;
            },
        },
        mounted() {
            for(var i=0;i<60;i++) {
                let kd = document.createElement("div");
                kd.className = "kd";
                kd.style.transform = `rotate(${6 * i}deg)`;
                if(i%5 ==0) {
                    kd.classList.add("long");
                }
                document.getElementById("kd-box").appendChild(kd);
            }
            this.timer = setInterval(() => {
                this.getCurrentTime();
            });

            let timeBox = document.getElementById("timeBox");
            timeBox.addEventListener("touchstart",ev=> {
                ev = ev.changedTouches[0];
                let disX = ev.pageX - timeBox.offsetLeft;
                let disY = ev.pageY - timeBox.offsetTop;
                fixedDoc();
                function mobildMove(ev) {
                    ev = ev.changedTouches[0];
                    timeBox.style.left = ev.pageX - disX + "px";
                    timeBox.style.top = ev.pageY - disY + "px";
                }
                document.addEventListener("touchmove",mobildMove, { passive: false });
                    document.addEventListener("touchend",ev=> {
                    document.removeEventListener("touchmove",mobildMove)
                    resetDoc()
                });
            })

            timeBox.onmousedown = function(ev) {
                let disX = ev.pageX - timeBox.offsetLeft;
                let disY = ev.pageY - timeBox.offsetTop;
                document.onmousemove = function(ev) {
                    timeBox.style.left = ev.pageX - disX + "px";
                    timeBox.style.top = ev.pageY - disY + "px";
                    ev.preventDefault();
                }
                document.onmouseup = function(ev) {
                    document.onmousemove = document.onmouseup = null;
                    ev.preventDefault();
                }
            }
        },
        destroyed() {
            clearInterval(this.timer);
        }
    }
</script>
