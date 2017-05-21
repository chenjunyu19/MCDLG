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

function fillVersion(version) {
  document.getElementById('text1').value = version;
}

function getVersions() {
  getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json', function (json) {
    var element = document.getElementById('drawer-nav');
    element.innerHTML = '<a class="mdl-navigation__link" href="javascript:getVersions();">刷新列表</a>';
    for (var i in json.versions) {
      if (json.versions.hasOwnProperty(i)) {
        var version = json.versions[i].id;
        element.innerHTML += '<a class="mdl-navigation__link" href="javascript:fillVersion(\'' + version + '\');">' + version + '</a>';
      }
    }
  });
}

function genDownloadLink() {
  var title = document.getElementById('download-card__title');
  var output = document.getElementById('output');
  title.className = 'mdl-card__title mdl-color--blue mdl-color-text--white';
  output.innerHTML = '<h1>:|</h1><p>正在生成。</p>';
  getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json', function (json) {
    var download = document.getElementById('text1').value;
    for (var i in json.versions) {
      if (json.versions.hasOwnProperty(i) && json.versions[i].id === download) {
        var version = json.versions[i];
        getJson(version.url, function (versionJson) {
          var string = '<h1>:)</h1><p>生成完毕。</p><p>';
          string += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="' + version.url + '">JSON</a>';
          string += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="' + versionJson.downloads.client.url + '">客户端</a>';
          if (versionJson.downloads.hasOwnProperty('server')) {
            string += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="' + versionJson.downloads.server.url + '">服务端</a>';
          }
          string += '</p><p>';
          string += '客户端 SHA-1：<code>' + versionJson.downloads.client.sha1 + '</code>';
          if (versionJson.downloads.hasOwnProperty('server')) {
            string += '<br>服务端 SHA-1：<code>' + versionJson.downloads.server.sha1 + '</code>';
          }
          string += '</p>';
          output.innerHTML = string;
          title.className = 'mdl-card__title mdl-color--green mdl-color-text--white';
        });
        return;
      }
    }
    title.className = 'mdl-card__title mdl-color--red mdl-color-text--white';
    output.innerHTML = '<h1>:(</h1><p>生成失败。找不到所选版本，请确认所选版本是否存在或检查网络。</p>';
  });
}