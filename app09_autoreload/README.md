electron-connectの使い方メモ
====

何？
----
*.htmlとか*.jsを修正・保存したときにライブローディングしてくれるモジュール。

使い方メモ
----
    $ mkdir -p ~/work/electron_memoapp09_autoreload/
    $ cd ~/work/electron_memoapp09_autoreload/
    
    
    # まずpackage.jsonでgulpとelectron-connectを使うように指定。
    $ vi package.json
    
        {
          "name"    : "app09_autoreload",
          "version" : "0.0.1",
          "main"    : "app.js",
          "devDependencies": {
            "gulp": "^3.8.8",
            "electron-connect": "^0.2.1"
          }
        }

    # npmコマンドで必要なモジュールをインストール
    $ npm install
    
    # gulpfile.jsを用意
    $ vi gulpfile.js
    
        var gulp = require('gulp');
        var electron = require('electron-connect').server.create();
        
        gulp.task('serve', function () {
          electron.start();
          gulp.watch('app.js', electron.restart);
          gulp.watch(['index.js', 'index.html'], electron.reload);
        });
        
        gulp.task('default', ['serve']);
    
    # app.jsを用意。
    $ vi app.js
    
        var app = require('app');
        var BrowserWindow = require('browser-window');
        var client = require('electron-connect').client;  // ←ここを追加
        
        var mainWindow = null;
        
        app.on('window-all-closed', function() {
          if (process.platform != 'darwin')
            app.quit();
        });
        
        function createWindow(title_string) {
        	var w = new BrowserWindow({
        		width: 1000,
        		height: 600,
        		title: title_string,
        	});
        
        	w.setMenu(null);
          w.openDevTools();
        
        	return w;
        }
        
        app.on('ready', function() {
          var mainWindow = createWindow();
          mainWindow.loadUrl('file://' + __dirname + '/index.html');
          mainWindow.on('closed', function() {
            mainWindow = null;
          });
        
          // Connect to server process
          client.create(mainWindow);  // ←ここを追加
        });
    
    # app.jsが表示するindex.htmlを作成
    # electron-connectのclientを準備するのを忘れないように。
    $ vi index.html
        <html>
        <head>
        <meta charset="utf-8">
            <title>app08_remote</title>
            
            <!-- build:remove -->
            <!-- Connect to server process -->
            <script>require('electron-connect').client.create()</script>
            <!-- end:build -->
            </head>
        <body onLoad="init()">
            ここに何か文章を書きます。
        </body>
        </html>
    
    # あとは、gulpコマンドでアプリケーションを実行する
    $ gulp
    
    # index.htmlを変更・保存した場合は、リロードがかかる
    $ vi index.html
    
    # app.jsを変更・保存した場合は、アプリケーションが再起動される
    $ vi app.js
    