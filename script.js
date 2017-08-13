function getJson(jsonUrl, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', jsonUrl);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      callback(JSON.parse(request.responseText));
    }
  }
  request.send(null);
}

function getVersions() {
  getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json', function (json) {
    var element = document.getElementById('drawer-nav');
    element.innerHTML = '<a class="mdl-navigation__link" href="javascript:getVersions();">刷新列表</a>';
    for (var i in json.versions) {
      if (json.versions.hasOwnProperty(i)) {
        var version = json.versions[i].id;
        element.innerHTML += '<a class="mdl-navigation__link" href="javascript:genGameDownloadLink(\'' + version + '\');">' + version + '</a>';
      }
    }
  });
}

function genGameDownloadLink(version) {
  var supporting = document.querySelector('#game-card .mdl-card__supporting-text');
  var actions = document.querySelector('#game-card .mdl-card__actions');
  supporting.innerHTML = '<h1>:|</h1><h3>正在生成。</h3>';
  getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json', function (json) {
    for (var i in json.versions) {
      if (json.versions.hasOwnProperty(i) && json.versions[i].id === version) {
        var versionUrl = json.versions[i].url;
        getJson(versionUrl, function (versionJson) {
          var infoHTML = '<h1>:)</h1><h3>生成完毕。</h3>';
          infoHTML += '客户端 SHA-1：<code>' + versionJson.downloads.client.sha1 + '</code>';
          if (versionJson.downloads.hasOwnProperty('server')) {
            infoHTML += '<br>服务端 SHA-1：<code>' + versionJson.downloads.server.sha1 + '</code>';
          }
          var linksHTML = '<a class="mdl-button mdl-button--colored" href="' + versionUrl + '">JSON</a>';
          linksHTML += '<a class="mdl-button mdl-button--colored" href="' + versionJson.downloads.client.url + '">客户端</a>';
          if (versionJson.downloads.hasOwnProperty('server')) {
            linksHTML += '<a class="mdl-button mdl-button--colored" href="' + versionJson.downloads.server.url + '">服务端</a>';
          }
          supporting.innerHTML = infoHTML;
          actions.innerHTML = linksHTML;
        });
        return;
      }
    }
    supporting.innerHTML = '<h1>:(</h1><h3>生成失败。找不到所选版本，请确认所选版本是否存在或检查网络。</h3>';
  });
}

function genLauncherDownloadLink() {
  var supporting = document.querySelector('#launcher-card .mdl-card__supporting-text');
  var actions = document.querySelector('#launcher-card .mdl-card__actions');
  supporting.innerHTML = '<h1>:|</h1><h3>正在生成。</h3>';
  getJson('https://launchermeta.mojang.com/mc/launcher.json', function (json) {
    var infoHTML = '<h1>:)</h1><h3>生成完毕。</h3>';
    infoHTML += '<h4>Java</h4>SHA-1：<code>' + json.java.sha1 + '</code><h5>LZMA</h5>SHA-1：<code>' + json.java.lzma.sha1 + '</code>';
    infoHTML += '<h4>Linux</h4>Download hash：<code>' + json.linux.downloadhash + '</code><h5>Versions</h5><h6>Launcher</h6>Commit：<code>' + json.linux.versions.launcher.commit + '</code><br>Name：<code>' + json.linux.versions.launcher.name + '</code>';
    infoHTML += '<h4>OS X</h4>App hash：<code>' + json.osx.apphash + '</code><br>Download hash：<code>' + json.osx.downloadhash + '</code><h5>64 Bits</h5><h6>JDK</h6>SHA-1：<code>' + json.osx[64].jdk.sha1 + '</code><br>Version：<code>' + json.osx[64].jdk.version + '</code><h6>JRE</h6>SHA-1：<code>' + json.osx[64].jre.sha1 + '</code><br>Version：<code>' + json.osx[64].jre.version + '</code><h5>Versions</h5><h6>Launcher</h6>Commit：<code>' + json.osx.versions.launcher.commit + '</code><br>Name：<code>' + json.osx.versions.launcher.name + '</code>';
    infoHTML += '<h4>Windows</h4>App hash：<code>' + json.windows.apphash + '</code><br>Download hash：<code>' + json.windows.downloadhash + '</code><h5>32 Bits</h5><h6>JDK</h6>SHA-1：<code>' + json.windows[32].jdk.sha1 + '</code><br>Version：<code>' + json.windows[32].jdk.version + '</code><h6>JRE</h6>SHA-1：<code>' + json.windows[32].jre.sha1 + '</code><br>Version：<code>' + json.windows[32].jre.version + '</code><h5>64 Bits</h5><h6>JDK</h6>SHA-1：<code>' + json.windows[64].jdk.sha1 + '</code><br>Version：<code>' + json.windows[64].jdk.version + '</code><h6>JRE</h6>SHA-1：<code>' + json.windows[64].jre.sha1 + '</code><br>Version：<code>' + json.windows[64].jre.version + '</code><h5>Versions</h5><h6>Launcher</h6>Commit：<code>' + json.windows.versions.launcher.commit + '</code><br>Name：<code>' + json.windows.versions.launcher.name + '</code>';
    var linksHTML = '<a class="mdl-button mdl-button--colored" href="' + json.java.lzma.url + '">Java - LZMA</a>';
    linksHTML += '<br><a class="mdl-button mdl-button--colored" href="' + json.linux.applink + '">Linux - App</a>';
    linksHTML += '<br><a class="mdl-button mdl-button--colored" href="' + json.osx.applink + '">OS X - App</a><a class="mdl-button mdl-button--colored" href="' + json.osx[64].jdk.url + '">OS X - 64 Bits - JDK</a><a class="mdl-button mdl-button--colored" href="' + json.osx[64].jre.url + '">OS X - 64 Bits - JRE</a>';
    linksHTML += '<br><a class="mdl-button mdl-button--colored" href="' + json.windows.applink + '">Windows - App</a><a class="mdl-button mdl-button--colored" href="' + json.windows[32].jdk.url + '">Windows - 32 Bits - JDK</a><a class="mdl-button mdl-button--colored" href="' + json.windows[32].jre.url + '">Windows - 32 Bits - JRE</a><a class="mdl-button mdl-button--colored" href="' + json.windows[64].jdk.url + '">Windows - 64 Bits - JDK</a><a class="mdl-button mdl-button--colored" href="' + json.windows[64].jre.url + '">Windows - 64 Bits - JRE</a>';
    supporting.innerHTML = infoHTML;
    actions.innerHTML = linksHTML;
    return;
  });
  supporting.innerHTML = '<h1>:(</h1><h3>生成失败。请检查网络。</h3>';
}