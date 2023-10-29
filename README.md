# Junan Shift

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2023/07/JPHACKS2023_ogp.png)](https://www.youtube.com/watch?v=yYRQEdfGjEg)

## 発表スライド
https://docs.google.com/presentation/d/16T2h_dpMZf4FAdIHDdQWfNyYTskcQmF9Do2RnIK7cfI/edit#slide=id.p

## デモ動画

[UI](https://drive.google.com/file/d/1jyVQ-bBHN3JSkMJgJgQJP9clY6me9iFL/view?usp=sharing)

[google calender空き状況提案](https://drive.google.com/file/d/1xrBp0q6cQC-NGbx05gBbe_cKPCaSYn41/view?usp=sharing)

[google calender シフト日をカレンダーに自動入力](https://drive.google.com/file/d/1vjxze59ez6T8G1KYCVpXRrGZt4rcKOrw/view?usp=sharing)

[最適シフト探索アルゴリズム](https://drive.google.com/file/d/1T5fLHn6TO3YCoZtcWaZOTVozGbdOD4uv/view?usp=sharing)

### 結論

**アイデア出しから実装まで**をすべてHack day当日に行った。
班員のうち、frontendをやったことがあるのが２人。ReactやNextjsを触ったことがあるのが１人という状況の中で、ネットを調べ試行錯誤を重ねながら作成した。

最後まで完成させきることはできなかったが、以下の機能を実装した。
ロボットの部品はできているが、組み立てられていない状態である。

* ホームページ上でのページ遷移
* データベースへのpostとgetに基づいてページの内容を表示
  * これは一部ページのみ
* 手入力で与えたシフト希望日のデータに対する最適シフトの導出
* 手入力で与えたデータシフト結果やシフト候補日に対してのグーグルカレンダー連携

## 動作方法

* backendディレクトリ、フロントエンドディレクトリにある構成方法に従う

## 製品概要

### 背景(製品開発のきっかけ、課題等）

チームメンバーの１人が所属している民族舞踊のサークルで、公演のシフトを決めるのがめんどくさいと思ったのがきっかけです。同じアジア系の国の人は別日の公演。アラブ系と中華系を同じ日の公演。オーディエンスが飽きないためのシフト調整を考えるのは大変でした。そこで、細かい日程調整をしてくれるウェブアプリを作成することにしました。

このアプリは、民族舞踊のジャンルにとどまらず、企業内のグループでも活用できると思います。

シフトを提出する人の所属や性別を登録することで、「係長や部門長にはこの日のミーティングに絶対出てもらいたい！」「営業部門と広報部門が揃うように日程調整をしたい！」「男性だけのミーティングにしたい！」など、柔軟なシフト作成ができます

### 製品説明（具体的な製品の説明）

### 特長

#### 1. 柔軟なシフト募集の実現

会社内の役職や性別ごとに細かい条件を指定してシフトを作成することができます。

##### 例

> AさんとBさんは不仲だから別の日程にしたい

> 営業について話すので○日のミーティングには営業部門長に出席してほしい

> 男性だけのミーティングをして男性化粧品に対する意見を聞きたい

> ○○さんは家が遠いからどうせ出勤するのであれば２日連続のシフトにしたい。

#### 2. Google Calenderとの連携

Google Calenderと連携することで便利な２つの機能を提供しています。

1. 自分のスケジュールとシフトが募集されている日を見比べます。その中で空いている日時を提案します。そうすることで、カレンダーアプリとシフト希望を出すアプリを切り替える手間がなくなります。

2. シフトが決まった際、自分のグーグルカレンダーにそれを反映させます。

#### 3. 独自開発したシフト調整アルゴリズム

このアプリケーションは要望に対して何らかの意味で最適なシフトを提供することが目的となります。
このような問題は理論的にはスケジューリング問題として定式化することが可能ですが、良く知られたようにスケジューリング問題は多くの場合NP困難であることが経験的に分かっており、今回のような要望が複雑になり得る場合はまず間違いなくそうでしょう。
そこで最適解を適切に近似する必要があるので、今回は条件を絶対に満たすべき条件である必須条件と、解の良し悪しを比べるための推奨条件に分けて、必須条件を拘束条件とした上で推奨条件によって評価値を生成して拘束条件下における離散最適化問題として問題を解くことにしました。
用いたアルゴリズムは拘束条件をもとにまず適当に初期解を探し、その後拘束条件を保ちながら初期解を変化させて最適解を探すという方法をとりました。
初期解の探索は極端な場合をまず考えて、そこからのランダムな遷移で拘束条件を満たす解を探すという方法をとりました。この方法ではまずサイズが大きくなりすぎると上手くいかなくなりますが、今回の想定では小規模の使用を考えていたことと、実装の時間的な制約のために適当に解を見つけ出すだけならば可能ではないかという考えのもとこの方針をとりましたが、この点は改善の余地がかなりあるでしょう。
次に最適解の探索ですが、これは評価関数を使って初期解をランダムに遷移させながら評価関数の値が上昇する方向に解を移していきました。このときに、最初に設定した要望以外にも、例えば飛び飛びでシフトが入るようなことを防ぐために、シフトに連続して入っていない場合は適切に減点処理を行うなどの目的に合った工夫をしました。

### 解決出来ること

プロジェクトチームや部門、役職、性別などに合わせた柔軟なシフトの作成を可能にします。

### 今後の展望

* ユーザー登録をすることで属性を選ぶ手間をなくす
* UIの改善
* シフト作成アルゴリズムをより高度にする

### 注力したこと（こだわり等）

* アイデア出しから実装までのすべての当日開発
* シフト作成アルゴリズムの作成
* バックエンド、フロントエンド間のデータ送受信
* Figmaによるデザインの作成
* 9人チームでの業務分担

## 開発技術

### 活用した技術

#### API・データ

* FastAPI
* Sqlite

#### フレームワーク・ライブラリ・モジュール

* Nextjs
* React

### 独自技術

#### ハッカソンで開発した独自機能・技術

* シフト作成をするアルゴリズム
