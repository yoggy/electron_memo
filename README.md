electron_memo
====
Electronを少しだけ使ってみたときのメモ書き。

  * http://electron.atom.io/
  * http://electron.atom.io/docs/
  * https://github.com/atom/electron/


Electronとは？
----
HTML, CSS, JavaScriptを使ってデスクトップアプリを作ることができる環境。
Windows, Mac, Linuxに対応している。
ElectronはChromiumとNode.jsを使用してクロスプラットフォームを実現している。

install
----
Node.jsがインストールされてる前提で。


    $ npm -g install electron-prebuilt


app01_helloworld
----


    $ cd ~/work/
    $ git pull https://github.com/yoggy/electron_memo.git
    $ cd electron_memo/app01_helloworld
    $ electron .


package.jsonの"main"に記述されているjsファイルがエントリポイント。


    {
      "name"    : "app01_helloworld",
      "version" : "0.0.1",
      "main"    : "main.js"
    }


main.jsは以下の内容。BrowserWindowを開いてindex.htmlを表示している。


    var app = require('app');
    var BrowserWindow = require('browser-window');

    var mainWindow = null;

    app.on('window-all-closed', function() {
        if (process.platform != 'darwin')
            app.quit();
    });

    app.on('ready', function() {
        mainWindow = new BrowserWindow({width: 640, height: 480});
        mainWindow.loadUrl('file://' + __dirname + '/index.html');
        mainWindow.on('closed', function() {
            mainWindow = null;
        });
    });


プロセスモデル
----
ElectronアプリケーションはMain processとRenderer processの2つが動作する。
Main processはpackage.jsonで指定されたメインスクリプトを駆動するプロセス。
Render processは表示に使用しているChroniumを駆動するプロセス。

Main processとRender processの間でipcモジュールや、remoteモジュールを使用する。


配布するときは…？
----
以下サイトからコンパイル済みバイナリ一式をダウンロード。
+ https://github.com/atom/electron/releases

  * Windowsの場合
    * electron/resources/app にアプリ一式をコピー。

  * Macの場合
    * electron/Electron.app/Contents/Resources/app/ にアプリ一式をコピー。

asarファイルを置く方法も用意されている。詳しくは以下ページ参照。
* [Application distribution](http://electron.atom.io/docs/v0.27.0/tutorial/application-distribution/)


debug
----
Main processをデバッグする場合、あらかじめnode-inspectorをインストールしておくこと。

    
    $ npm install node-inspector -g
    

次の手順でデバッグ可能。

    
    $ node-inspector
    $ electron --debug=5858 アプリのディレクトリ
    $ open  http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5858
    
