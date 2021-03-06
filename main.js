const endpoint = "mibook.ddns.iisjy.cn/nas"
let nowPath = "";
function init() {
    nowPath = new URL(window.location.href).searchParams.get('path');
    if (nowPath == null) {
        nowPath = "/";
        history.pushState(null, nowPath, `index.html?path=${encodeURIComponent(nowPath)}`)
    }
    load_files();
}

function open_dir(self) {
    nowPath += self;
    nowPath += "/";
    history.pushState(null, nowPath, `index.html?path=${encodeURIComponent(nowPath)}`)
    load_files();
}
function play_video(filename) {
    window.location.href = "player.html?source=" + encodeURIComponent(`https://${endpoint}${nowPath}${filename}`);
}
function download_file() {

}
function is_video(thistype) {
    const video_type = ["mp4", "mkv", "webm", "avi"]
    for (let i = 0; i in video_type; i++) {
        if (thistype == video_type[i])
            return true;
    }
    return false;
}
function getAction(self) {
    const filetype = self.type;
    if (filetype == "directory") return "open_dir(this.id)";
    else if (is_video(self.name.split(".").pop())) return "play_video(this.id)";
    else return "download_file()";
}
function getIcon(self){
    if(self.type=="directory") return "icon/dir.png";
    const filetype = self.name.split(".").pop();
    if(filetype == "mkv") return "icon/mkv.png";
    if(filetype == "mp4") return "icon/mp4.png";
    if(filetype == "png") return "icon/pic.png";
    if(filetype == "jpg") return "icon/pic.png";
    return "icon/unknown.png"

}
function getSize(self) {
    const filesize = self.size;
    if (self.type == "directory") return "[文件夹]"
    else if (filesize < 1024) return `[${parseInt(filesize)} Byte]`;
    else if (filesize < 1024 * 1024) return `[${parseInt(filesize / 1024)} KB]`;
    else if (filesize < 1024 * 1024 * 1024) return `[${parseInt(filesize / 1024 / 1024)} MB]`
    else return `[${parseInt(filesize / 1024 / 1024 / 1024)} GB]`
}
function load_files() {
    fetch(`https://${endpoint}${nowPath}`, { mode: 'cors' })
        .then(resp => resp.json())
        .then(files => {
            console.log(files)
            let ml_str = "";
            files.forEach(elem => {
                ml_str += `<div class="file_item" id="${elem.name}" onclick="${getAction(elem)}"><img height="100px" class="file_icon" src="${getIcon(elem)}"><div class="file_name">${getSize(elem)}${elem.name}</div></div>`;
                console.log(elem)
            });
            document.getElementById("file_view").innerHTML = ml_str;
        })
}