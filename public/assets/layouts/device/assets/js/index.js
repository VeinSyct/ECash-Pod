let windowEvent = (e) => {
    if (e.type.match(/(message)/)) try {
        _uz.session = !_uz.session ? e.data.session : _uz.session;
        if (e.data.action && e.data.action.match(/(ecash-api)/)) {
            if (e.data.action.match(/(ready)/)) {
                try {
                    openApp({});
                } catch (error) {}
            };
            if (e.data.action.match(/(response)/)) {
                apiResponses({ data: e.data });
            };
        };
        if (e.data.action && e.data.action.match(/(update-content)/))
            try {
                openApp({});
            } catch (error) {}
        if (e.data.action && e.data.action.match(/(snap-scrolling)/)) {};
    } catch (error) {};
},
_uz = { api: document.createElement("iframe"), digilete: (e) => {return e.data.replace(/[0-9]/g, '').replace(/\*/g,'/').replace(/&/g,':').replace(/%/g,'-').replace(/\$/g,'.')} };
let readBalance = () => {
    _uz.api.contentWindow.postMessage({ action: "ecash-api-read-balance" }, _uz.api.src);
};
window.addEventListener("message", windowEvent);
let readAccount = () => {
    _uz.api.contentWindow.postMessage({ action: "ecash-api-read-account" }, _uz.api.src);
};
_uz = Object.assign(_uz, { qrhash: (e) => _uz.api.src = _uz.digilete({ data: e.hash }) });
let apiResponses = (data) => {
    data = data.data;
    if (data.action && data.action.match(/(read-balance)/)) {
        document.querySelector(".calc-loading").style.display = "none";
        document.querySelector(".calc-display-backing").innerHTML = localStorage.balance = data.balance != "Err706" ? data.balance.replace("DMY", "(Dummy)") : `<span>Error: <strong class="calc-alert blink">Tampered!</strong></span>`;
    };
    if (data.action && data.action.match(/(read-account)/)) {
        document.querySelector(".account-name").innerHTML = data.account.name ? data.account.name : "N/A";
        for (let i = 0, j = ["number", "protocol", "currency"]; i < j.length; i++)
            document.querySelector(".account-" + j[i]).innerHTML = data.account[j[i]] == "DMY" ? "(Dummy)" : data.account[j[i]] ? data.account[j[i]] : "USD";
        if (localStorage.entry) {
            try {
                _uz.entry = JSON.parse(localStorage.entry);
                _uz.entry.object = {
                    action: `ecash-api-change-${_uz.entry.name ? "name" : "currency"}`,
                };
                _uz.entry.object[(_uz.entry.name ? "name" : "currency")] = _uz.entry[(_uz.entry.name ? "name" : "currency")];
                _uz.api.contentWindow.postMessage(_uz.entry.object, _uz.api.src);
                if (_uz.entry.name) document.querySelector(".account-name").innerHTML = _uz.entry[(_uz.entry.name ? "name" : "currency")];
                delete localStorage.entry;
            } catch (error) {}
        };
        localStorage.user = JSON.stringify({
            currency: _uz.entry && _uz.entry.currency ? _uz.entry.currency : data.account.currency,
            name: _uz.entry && _uz.entry.name ? _uz.entry.name : data.account.name,
            number: data.account.number
        });
        delete _uz.entry;
    };
    if (data.action && data.action.match(/(hash-account)/)) {
        document.querySelector(".calc-loading").style.display = "none";
        createQr({
            s: data.hash 
        });
    };
    if (data.action && data.action.match(/(hash-fragment)/)) {
        for (let i = 0; i < data.hash.length; i++) drawQr({ id: ".qr-cont", piece: data.hash[i] });
        _uz.z.cvs = { e: [], i: 0 };
        for (let i = 0, j = document.querySelector(".qr-cont").getElementsByTagName("canvas"); i < j.length; i++) {
            j[i].style.display = "none";
            j[i].className = "calc-canvas-qr";
            _uz.z.cvs.e.push(j[i]);
        };
        if (_uz.z.cvs.e.length > 1) autoSlide({ t: _uz.qr.delay });
        document.getElementById("show-qr-cont").style.display = "block";
    };
    if (data.action && data.action.match(/(hash-assemble)/)) {
        let d = JSON.parse(data.object);
        if (d.r) {
            if (d.r && d.ah) {
                localStorage.beneficiary = JSON.stringify(d.ah);
                localStorage.dialog = JSON.stringify({
                    message: `
                        <p><strong>Name: </strong><span>${d.ah.name}</span></p>
                        <p><strong>Account: </strong><span>${d.ah.number}</span></p>`,
                    buttons: `
                        <div class="_button-back calc-button ">❮ Back</div>
                        <div class="_button-next calc-button calc-red-button">Next ❯</div>`,
                    actions: {
                        back: {
                            shells: ["scanqr"],
                            index: 0
                        },
                        next: {
                            shells: ["keypad"],
                            index: 0
                        }
                    },
                    close: {
                        shells: ["settings", "home", "options"],
                        index: 2
                    }
                });
            };
            if (d.l) {
                if (d.r && d.l.received > 0) {
                    localStorage.dialog = JSON.stringify({
                        message: `${(d.l.currency ? `<strong>${d.l.currency}${`${`${d.l.received}`.replace(/(\.\d{2})\d+$/, '$1').replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</strong>` : `No`)} electronic cash has been transferred into your account ${(d.l.ratio && d.l.ratio < 1 ? ` and <strong>${(100 - parseFloat(d.l.ratio) * 100).toFixed(0)}%</strong> counterfiet is rejected!` : "")}`,
                        buttons: `
                            <div class="_button-back calc-button ">❮ Back</div>
                            <div class="_button-dismiss calc-button calc-red-button">Dismiss</div>`,
                        actions: {
                            back: {
                                shells: ["scanqr"],
                                index: 0
                            },
                            dismiss: {
                                shells: ["settings", "home", "options"],
                                index: 1
                            }
                        },
                        close: {
                            shells: ["settings", "home", "options"],
                            index: 1
                        }
                    });
                    if (localStorage.transactions) {
                        try {
                            d.tx = JSON.parse(localStorage.transactions);
                        } catch (error) {}
                    } else d.tx = {};
                    d.tx[(Math.random() + 1).toString(36).substring(7)] = {
                        incoming: !0,
                        name: d.s.name,
                        number: d.s.account,
                        hash: d.j,
                        currency: d.l.currency,
                        amount: d.l.received,
                        date: new Date().getDay() + " " + getTime({}) + ", " + getDate({}),
                    }
                    localStorage.transactions = JSON.stringify(d.tx);
                    if (d.l.currency) localStorage.entry = JSON.stringify({ currency: d.l.currency });
                } else localStorage.dialog = JSON.stringify({
                    message: `
                        Electronic cash is spent`,
                    buttons: `
                        <div class="_button-back calc-button ">❮ Back</div>
                        <div class="_button-dismiss calc-button calc-red-button">Dismiss</div>`,
                    actions: {
                        back: {
                            shells: ["scanqr"],
                            index: 0
                        },
                        dismiss: {
                            shells: ["settings", "home", "options"],
                            index: 2
                        }
                    },
                    close: {
                        shells: ["settings", "home", "options"],
                        index: 2
                    }
                });
            }
            delete _uz.z.qrScan.hashes;
            delete _uz.z.qrScan.arr;
        } else localStorage.dialog = JSON.stringify({
            message: `
                Wrong QR codes!`,
            buttons: `
                <div class="_button-back calc-button ">❮ Back</div>
                <div class="_button-dismiss calc-button calc-red-button">Dismiss</div>`,
            actions: {
                back: {
                    shells: ["scanqr"],
                    index: 0
                },
                dismiss: {
                    shells: ["settings", "home", "options"],
                    index: 2
                }
            },
            close: {
                shells: ["settings", "home", "options"],
                index: 2
            }
        });
        loadPage({ shells: ["dialog"], scroll: 0 });
    };
    if (data.action && data.action.match(/(transfer-amount)/)) {
        createQr({ s: data.hash });
        if (localStorage.transactions) {
            try {
                data.tx = JSON.parse(localStorage.transactions);
            } catch (error) {}
        } else data.tx = {};
        if (localStorage.beneficiary) {
            try {
                data.b = JSON.parse(localStorage.beneficiary);
                delete localStorage.beneficiary;
            } catch (error) {}
        }
        if (localStorage.transfer) {
            try {
                data.t = JSON.parse(localStorage.transfer);
                delete localStorage.transfer;
            } catch (error) {}
        }
        data.tx[(Math.random() + 1).toString(36).substring(7)] = {
            incoming: !1,
            name: data.b.name,
            number: data.b.number,
            hash: data.hash,
            currency: data.t.currency,
            amount: data.t.amount,
            date: new Date().getDay() + " " + getTime({}) + ", " + getDate({}),
        }
        localStorage.transactions = JSON.stringify(data.tx);
    };
    if (data.action && data.action.match(/(dialog-message)/)) {
        if (data.message.match(/(m000|m001|m002|m003)/)) {
            localStorage.dialog = JSON.stringify({
                message: `${
                    data.message == "m000" ? "Please select a <strong>benificiary</strong>" : data.message == "m001" ? "Please enter a numeric amount" : data.message == "m002" ? "Insuficient balance!" : data.message == "m003" ? "Your balance is not sufficient to make this transfer, please try a lesser amount" : ""
                }`,
                buttons: `
                    <div class="_button-back calc-button ">❮ Back</div>
                    <div class="_button-dismiss calc-button calc-red-button">Dismiss</div>`,
                actions: {
                    back: {
                        shells: data.message.match(/(m001|m002|m003)/) ? ["keypad"] : ["scanqr"],
                        index: 0
                    },
                    dismiss: {
                        shells: ["settings", "home", "options"],
                        index: 2
                    }
                },
                close: {
                    shells: ["settings", "home", "options"],
                    index: 2
                }
            });
        }
        if (data.message == "m004") localStorage.dialog = JSON.stringify({
            message: `
                Please select a correct currency`,
            buttons: `
                <div class="_button-back calc-button ">❮ Back</div>
                <div class="_button-dismiss calc-button calc-red-button">Dismiss</div>`,
            actions: {
                back: {
                    shells: ["currency"],
                    index: 0
                },
                dismiss: {
                    shells: ["settings", "home", "options"],
                    index: 0
                }
            },
            close: {
                shells: ["settings", "home", "options"],
                index: 0
            }
        });
        loadPage({ shells: ["dialog"], scroll: 0 });
    };
    if (data.action && data.action.match(/(qr-code-scan)/)) {
        data.s = document.createElement("script");
        data.s.appendChild(document.createTextNode(data.operation));
        document.body.appendChild(data.s);
    };
},
getTime = (d) => {
    d.d = new Date();
    d.hrs = d.d.getHours();
    d.min = d.d.getMinutes();
    d.apm = d.hrs >= 12 ? "PM" : "AM";
    d.hrs = d.hrs % 12;
    d.hrs = d.hrs ? d.hrs : 12;
    d.hrs = d.hrs < 10 ? " " + d.hrs : d.hrs;
    return d.hrs + ":" + (d.min = d.min < 10 ? "0" + d.min : d.min) + " " + d.apm;
},
getDate = (d) => {
    d.m = new Date();
    return d.m.getUTCFullYear() + ("0" + (d.m.getUTCMonth() + 1)).slice(-2) + ("0" + d.m.getUTCDate()).slice(-2);
};
