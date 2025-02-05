let planeText = (d) => {
    try {
        d.d = (d.text + "")[_uz.a[0]]("");
        d.c = d.d[0];
        d = Object[_uz.a[1]]({ e: d.bits, o: [d.c], l: d.c, t: {} }, d);
        for (d.i = 1; d.i < d.d.length; d.i++) {
            d.currCode = d.d[d.i][_uz.a[2]](0);
            if (d.currCode >= d.bits) {
                d.p = d.t[d.currCode] ? d.t[d.currCode] : d.l + d.c;
            } else d.p = d.d[d.i];
            d.o[_uz.a[3]](d.p);
            d.c = d.p[_uz.a[4]](0);
            d.t[d.e] = d.l + d.c;
            d.e++;
            d.l = d.p;
        }
        return d.o[_uz.a[5]]("");
    } catch (e) {}
},
_o = {
    name: "webapp-v001",
    offline: "index.html", 
    caches: [planeText({ text: `"assets/cĂ/lcd-screen.Ĉs",ĀĂĄĆĖ/styleĕĂĘĚăą/imageĆfavicoĔpngħāĩĆĬĮİĊČ-background.jpĻęĽĜīĭįĆċčdirtĭskŐŒļěĪŀřŃčŊiŏőœĨŖũłś-trŇkiĺ.gifŦľŗŁŚńĴgnĄtĤĹűŕŨŘłogŤƏŧĆjĿŎexŐėŔƘĊayŌĪdeĴcećhat.hŠlƂŖlƤƦĆƨƪƬcurđncyƱƳƵĪƷƥuƧƩĵƬŝalƔǅmƴơƃǉƹ/ƻǎ/homĤƲǕǇŚƸǋƺǍƫ/keyboarŏǣǖŲǈǧǌƼǬǮpaǴǆǗƶǹǩǻoptiķsǔǶƐǦǊǺǝďanqrȍǥƣȑȅȓƋżgȌǵȚǙǨǛǪƬsǟwȗșȂǸȜȧǻŸȕsŇȉȋȮǷȐǚǜǫȏćĉĠĢĤĖȤȄȲǝɀĞfķt-awİǠĤmżĥƠȻțȽȨ/ɀɍnĪɠtɑɓǡ-ɒbɣ.ttƁȯȼȦȾƬɟɎıɎɥsɔɨeɪɎ.wofɯɚȥȒȿƢɣɷɡɹɻɩɫʁʃ2ɇȱɳɞƢŴŚǱŝŽɩpʔɜǻɀʙ/ġpȠ waiưſʄɀʆȝʈƃʤʦȠžƀʠɲɝɀƚīƜƞƚʺʇɴƢʾǵ2cȕvāƟ˃ʲ˅ƃʾȭˊchĤ˂ɰɛʻʢˆĆ˔đƯoȘ˙ʅɈʖʽ˟Șˡƨˤəʰ˧ʼ˞/queriİˎ˚ʱɉʳŖ˓˶rǄ˂`, bits: 256 })]
};
_o.caches.push(_o.offline);
this.addEventListener("install", async (e) => {
    try {
        e.cache = await caches.open(_o.name);
        await e.cache.addAll(_o.caches);
    } catch (error) {}
});
this.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
            e.cache = await caches.open(_o.name);
            try {
                e.response = await e.cache.match(e.request);
                if (e.response) return e.response;
                e.response = await fetch(e.request);
                if (e.response) {
                    await e.cache.put(e.request, e.response.clone());
                    return e.response;
                };
            } catch (err) {
                return await e.cache.match(_o.offline);
            }
        })()
    );
});
