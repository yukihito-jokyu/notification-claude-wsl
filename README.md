# notification-claude-wsl

このプロジェクトは、Claude Code によるタスク実行後に通知を送るための仕組みを提供します。
notification-claude-wsl.mjs は、[こちらの Gist](https://gist.github.com/laiso/775c096360b8468e1ada73b780d51a61) を参考に作成しました。
元のコードは macOS 専用でしたが、本プロジェクトでは WSL（Windows Subsystem for Linux）環境で動作するように再構築しています。

## 使用方法

Windows PowerShell を管理者権限で起動し、`BurntToast`をインストールする。

```
Install-Module BurntToast
```

`~/.claude/hooks`ディレクトリに`notification-claude-wsl.mjs`を配置

`notification-claude-wsl.mjs`に実行権限を付与

```bash
chmod +x ~/.claude/hooks/notification-claude-wsl.mjs
```

`~/.claude/settings.json`に以下を記述

```
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/notification-claude-wsl.mjs"
          }
        ]
      }
    ]
  }
}
```
