let onMessage = (e) => {
    if (e.data && e.data.action && e.data.action.match(/(load-shells)/)) {
        document.querySelector(".snap-container").innerHTML = e.data.shell;
        _uz.s = e.data.scroll;
        onWindowResize({});
    }
    if (e.data && e.data.action && e.data.action.match(/(restore-shells)/)) {
        document.querySelector(".snap-container").innerHTML = _uz.restore.shells;
        _uz.s = _uz.restore.scroll;
        onWindowResize({});
        _uz.chB.style.display = "block";
        for (let k in _uz.e) if (_uz.e[k] && _uz.e[k].className) _uz.e[k].style.display = "block";
    }
},
onScrolling = (e) => {
    clearTimeout(e.target.scrollTimeout);
    e.target.scrollTimeout = setTimeout(() => {
        e.o = document.body.clientWidth > document.body.clientHeight && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        _uz.s = parseInt(e.target["scroll" + (e.o ? "Left" : "Top")] / (parseInt(window.getComputedStyle(document.body)[e.o ? "width" : "height"]) - 3));
        e.d = document.getElementById("shell-" + _uz.s).getElementsByTagName("iframe")[0];
        if (e.d) {
            if (_uz.p != _uz.s) {
                _uz.p = _uz.s;
                _uz.q = _uz.q ? _uz.q : [];
                if (!_uz.q.includes(_uz.p)) _uz.q.push(_uz.p);
                e.d.contentWindow.postMessage({ action: "update-content" });
                delete _uz.scrolling;
            } else if(!_uz.scrolling){
                _uz.scrolling = !0;
                for (let i = 0; i < _uz.q.length; i++) {
                    e.d = document
                    .getElementById("shell-" + _uz.q[i])
                    .getElementsByTagName("iframe")[0]
                    .contentWindow.postMessage({ action: "snap-scrolling" });
                }
            }
        }
    }, 10);
},
onWindowResize = (d) => {
    d.o = document.getElementsByTagName("iframe");
    if (d.o.length < 3) {
        document.querySelector(".snap-container").style.overflow = "hidden";
    } else document.querySelector(".snap-container").style.overflow = "auto";
    d.o = document.getElementsByTagName("iframe")[_uz.s];
    if (d.o) d.o.scrollIntoView();
},
fullscreen = (d) => {
    if (!_uz.full) {
        _uz.full = !0;
        try {
            if (d.scr.requestFullscreen) {
                d.scr.requestFullscreen();
            } else if (d.scr.msRequestFullscreen) {
                d.scr.msRequestFullscreen();
            } else if (d.scr.mozRequestFullScreen) {
                d.scr.mozRequestFullScreen();
            } else if (d.scr.webkitRequestFullscreen)
                d.scr.webkitRequestFullscreen();
        } catch (e) {}
    } else {
        delete _uz.full;
        if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
    }
},
_uz = { s: 0, buttons: [], offline: !0 };
_uz.e = document.getElementsByClassName("calc-buttons-cont");
for (let k in _uz.e) {
    if (_uz.e[k] && _uz.e[k].className && !_uz.buttons.includes(_uz.e[k].className)) {
        _uz.buttons.push(_uz.e[k].className);
        _uz.e[k].addEventListener("click", (e) => {
            _uz.chB = e.target;
            if (_uz.e[k].className.match(/(openquery|faqs)/)) {
                _uz.c = document.querySelector(".snap-container");
                if (_uz.c) {
                    _uz.restore = {
                        shells: _uz.c.innerHTML,
                        scroll: _uz.s
                    }
                    _uz.s = 0;
                    _uz.c.innerHTML = `
                        <div id="shell-0">
                            <div>
                                <div>
                                    <div class="lcd-effects-on"><div class="back-grid"></div></div>
                                    <iframe id="iframe-chat" src="assets/layouts/device/${_uz.e[k].className.match(/(openquery)/) ? "chat" : "faqs"}.html"></iframe>
                                </div>
                            </div>
                        </div>
                        <br />`;
                    onWindowResize({});
                    for (let k in _uz.e) if (_uz.e[k] && _uz.e[k].className) _uz.e[k].style.display = "none";
                }
            }
            if (_uz.e[k].className.match(/(fullscreen)/)) {
                _uz.e[k].getElementsByTagName("div")[0].innerHTML = _uz.full ? "⇱" : "⇲";
                fullscreen({ scr: document.body });
            }
        });
    };
};
window.addEventListener("resize", () => {
    onWindowResize({});
});
window.addEventListener("message", onMessage);
onWindowResize({});
document.querySelector(".snap-container").addEventListener("scroll", onScrolling);
if (navigator.onLine && _uz.offline && "serviceWorker" in navigator)
    navigator.serviceWorker
        .register("index.js")
        .then((registration) => {})
        .catch((err) => {});
