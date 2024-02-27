<!-- 
  组件说明： 本组件为系统管理员多语言配置组件。
  进入方式： 系统管理员登录后点击导航栏"多语言配置"。
  用户权限： 系统管理员可以使用。
-->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="$t('message.多语言配置')" goBack=false></PageHeader>
            <!-- 标题 end -->
            <!-- 导入按钮 start -->
            <div class="importBox">
                <label>
                    <span class="nmbtn">{{$t('message.导入excel')}}</span>
                    <input type="file" @change="importExcel" v-show="false">
                </label>
                <p>Description: After uploading Excel, a text file will be automatically generated and downloaded. Please make sure the name of the downloaded text file is "language. txt"</p>
            </div>
            <!-- 导入按钮 end -->
        </a-card>
    </div>
</template>
<style scoped>
    .nmbtn {padding: 9px 15px; font-size: 12px; border-radius: 3px;display: inline-block; line-height: 1; white-space: nowrap; cursor: pointer; background: #409EFF; border: 1px solid #409EFF; color: #FFF; -webkit-appearance: none; text-align: center; box-sizing: border-box; outline: none; margin: 0; transition: .1s; font-weight: 500; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; border-radius: 4px;}
    .nmbtn:hover {color: #fff; border-color: #66b1ff; background-color: #66b1ff; }
    .importBox {text-align: center;padding: 40px 0;}
    .importBox p {font-size: 12px;color: #333;margin-top: 30px;}
</style>
<script>
    import * as XLSX from "XLSX"
    export default {
        components: {
        },
        methods: {
            // 导入语言excel
            importExcel(e) {
                let file = e.target.files[0];
                if(!/sheet/.test(file.type)) {
                    this.$message({
                      type: 'error',
                      message: '文件类型不正确'
                    });
                    return;
                }
                const fileReader = new FileReader();
                fileReader.readAsBinaryString(file);
                let _this = this;
                fileReader.onload = function(event) {
                    try {
                        const { result } = event.target;
                        const workbook = XLSX.read(result, { type: 'binary' });
                        let data = [];
                        for (const sheet in workbook.Sheets) {
                            if (workbook.Sheets.hasOwnProperty(sheet)) {
                                data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                            }
                        }
                        let param_item = data.map(item=> {
                            return {
                                zh: item["zh"],
                                en: item["en"],
                            }
                        });
                        let resultJson = "{";
                        param_item.forEach(item => {
                            resultJson += `"${item["zh"]}": "${item["en"]}",`;
                        });
                        resultJson = resultJson.substring(0,resultJson.length - 1);
                        resultJson += "}"
                        let resultJs = `let languageList = ${resultJson}`;
                        _this.download("language.txt",resultJs);
                        e.target.value = "";
                    } catch(e) {
                        _this.$message({
                          type: 'error',
                          message: '文件类型不正确'
                        });
                    }
                }
            },
            // 下载文件
            download(filename, text) {
              var element = document.createElement('a');
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
              element.setAttribute('download', filename);
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }
        }
    }
</script>