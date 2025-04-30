---
marp: true
style: |
  section {
    font-family: 'Segoe UI', sans-serif;
    color: #3F3F3F;
    background:hsl(0, 0.00%, 98.00%);
  }
  h1, h2, h3 {
    color: #295a8d;
    text-align: left;
    margin-top: 0.5em;
    margin-bottom: 0.2em;
    font-weight: 700;
  }
  h1, h2 {
    border-bottom: 2px solid #295a8d;
    padding-bottom: 0.2em;
    margin-bottom: 0.7em;
  }
  h1 {
    font-size: 2.2em;
    margin-top: 0.2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h2:has(+.topic) {
    padding-bottom: 0em;
    margin-bottom: 0em;
  }
  .topic {
    color: #295a8d;
    font-size: 0.9em;
    text-align: center;
    margin-bottom: 1.0em;
    font-weight: 500;
    text-align: left;
  }
  section {
    padding-top: 2.5em;
  }
  header {
    position: absolute;
    top: 0.7em;
    left: 0;
    width: 100%;
    text-align: left;
    z-index: 10;
  }
  section:first-of-type h1, section:first-of-type header {
    text-align: center !important;
  }
  blockquote > blockquote > blockquote {
    font-size: 50%;
    font-weight: 400;
    padding: 0;
    margin: 0;
    border: 0;
    border-top: 0.1em dashed #555;
    position: absolute;
    bottom: 70px;
    left: 70px;
  }
  .flex{
    display: flex;
    gap: 1em;
  }
  .sa {
    justify-content: space-around;
  }
  .sb {
    justify-content: space-between;
  }
  .ss {
    justify-content: start;
  }
  .sa div,.sb div,.ss div{
    margin: 0.1em;
  }
  .fw div{
    flex: var(--fw);
  }
---

# AUTD3 講習会

鈴木 颯
東京大学 篠田・牧野研究室 特任助教
2025/xx/xx

---

## はじめに

- 本スライドで扱うのは以下のバージョンです
  - Firmware version 11.0.0
  - Software version 32.1.1

- autd3の情報は https://github.com/shinolab/autd3 に集約されています

- スライド自体のソースは https://github.com/shinolab/autd3-lecture.git にあります

---

## AUTD3とは

- AUTD3: Airborne Ultrasound Tactile Display ver. 3
- 超音波の振幅/位相を制御することで, 空間に様々な音場を生成
- 音響放射圧を利用して, 人体の表面を非接触で押すことが主な目的
- AUTD3は複数のデバイスを連結して一つの大きなPhased arrayを構成することが可能
- Tactile以外の用途で使う時は, Airborne Ultrasound Phased Arrayとも呼んでる
  - ただし, デバイス名はあくまでもAUTD3

---

## 超音波フェーズドアレイの原理

<div class="flex sa">

<canvas id="demo"></canvas>

<div>

- フェーズドアレイとは？
  - 位相を個別に制御できる振動子を配列したもの
  - 典型的には格子状に配列

- 位相 ($\sim$音の出るタイミング) を制御し, 音の干渉を利用して音場を生成

</div>

</div>

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/"
  }
}
</script>
<script type="module" src="./phased-array.js"></script>

---

## AUTD3のアーキテクチャ

<div class="flex ss">

![height:500](autd3-arch.svg)

<div>

- AUTD3デバイスは以下の3つから構成される
  - CPUボード: 主に通信を担当
  - FPGA: 主に駆動信号生成を担当
  - 振動子アレイ

</div>

</div>

---

## 単一デバイスの動作について

<div class="topic">あるいはFPGAファームウェアのアーキテクチャ</div>

---
 
## AUTD3のアーキテクチャ in FPGA

![width:1920](sig-gen.svg)

---

## PWMモジュール

<div class="topic">AUTD3のアーキテクチャ in FPGA</div>

<div class="flex sa">

![width:400](sig-gen-pwm.svg)

<div>

- PWMモジュールはパルス幅と位相データを受け取って駆動信号を生成する

</div>

---

## PWM?

<style scoped>
.container {
  width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF;
}
.controls {
  font-size: 0.6em;
}
.controls label{
  display: inline-block;
  width: 60px;
}
.controls span{
  display: inline-block;
  width: 50px;
}
.plot-container h2 {
  font-size: 0.6em;
  font-weight: 400;
  border-bottom: none;
  color: #3F3F3F;
  text-align: center;
}
</style>

<div class="flex sa">

<div class="container">
  <div class="controls">
      <div>
          <label for="dutySlider">Duty比:</label>
          <input type="range" id="dutySlider" min="0" max="1" step="0.01" value="0.5">
          <span id="dutyValue">0.50</span>
      </div>
      <div>
          <label for="phaseSlider">位相:</label>
          <input type="range" id="phaseSliderRad" min="0" max="2" step="0.01" value="1">
          <span id="phaseValueRad">π</span>
      </div>
  </div>
  <div class="plot-container">
      <h2>矩形波 (PWM信号)</h2>
      <canvas id="rectWaveCanvas" width="400" height="150"></canvas>
  </div>
  <div class="plot-container">
      <h2>基本波成分 (正弦波)</h2>
      <canvas id="sineWaveCanvas" width="400" height="150"></canvas>
  </div>
</div>

<div>

- PWM: Pulse Width Modulation
  - 矩形波のDuty比 (パルス幅 / 周期) を変えることで, 超音波の出力を変化させる手法

- Duty比 $=0.5$の時, 出力が最大
  - Duty比は$[0, 0.5]$の範囲で単調増加

- AUTD3では, 周期 $=512$としている
  - 位相は2倍して使う $([0,255]\rightarrow[0,510])$
  - パルス幅は9bit必要$([0,256])$

</div>

</div>

<script type="module" src="./pwm.js"></script>

---

## Pulse Width Encoder

<div class="topic">AUTD3のアーキテクチャ in FPGA</div>

<div class="flex sa">

![width:400](sig-gen-pwe.svg)

<div>

- 入力: 強度データ (8bit), 出力: パルス幅 (9bit)
  - パルス幅と出力振幅の非線形性の補正
  - 8bitデータ $([0,255])$を9bitデータ $([0,256])$に変換

- PWMにおける非線形性$^1$: $A \propto \sin\left(\pi\frac{D}{512}\right)$
  - $A$: 出力振幅, $D$: パルス幅

- 実体は強度$E$をアドレス, パルス幅$D$をデータとするテーブル (書き換え可)
  - デフォルトだと$D=\left[\frac{512}{\pi}\arcsin\left(\frac{E}{255}\right)\right]$

>>> 1: 理論上. 実測では$A \propto \sin^\alpha\left(\pi\frac{D}{512}\right),\alpha=0.83$とか.

</div>

---

## Silencer

<div class="topic">AUTD3のアーキテクチャ in FPGA</div>

<div class="flex sa">

![width:400](sig-gen-silencer.svg)

<div>

- 強度, 位相データの急峻な変化を抑えるモジュール
  - これによって, 可聴音ノイズを抑制する$^1$

>>> 1: Suzuki, Shun, et al. “Reducing amplitude fluctuation by gradual phase shift in midair ultrasound haptics.” IEEE transactions on haptics 13.1 (2020): 87-93.

</div>

---

## Silencerによる位相変化抑制

<div class="topic">AUTD3のアーキテクチャ in FPGA: Silencer</div>

<div class="flex sa">

![width:800](silencer_normal.svg)

<div>

- 左の図は, 周期$T=12$の場合, $t=t_s$で位相$P$が$2$から$6$に変化した場合

- 基本的には, 単純移動平均フィルタと同じ動作
  - ただし, **位相の周期性を考慮する**
  - また, 途中で目標値が動的に変わる場合も異なる挙動になる

</div>

---

## Silencerによる位相変化抑制 - 位相の周期性

<div class="topic">AUTD3のアーキテクチャ in FPGA: Silencer</div>

<div class="flex sa">

![width:800](silencer_wrap.svg)

<div>

- 左の図は, 周期$T=12$の場合, $t=t_s$で位相$P$が$2$から$10$に変化した場合
  - これは, $P=2$からは$P=10$よりも$P=-2$の方が近いため

</div>

---

## Silencerによる位相変化抑制 - 動的な更新

<div class="topic">AUTD3のアーキテクチャ in FPGA: Silencer</div>

<div class="flex sa">

![width:800](silencer_dynamic.svg)

<div>

- 途中でもう一度位相が変化する場合の挙動は, 移動平均フィルタとは異なる

  - AUTD3の実装では, 現在の値 (=直前の出力) と 現在の入力値しか考慮しない

</div>

---

## Silencerのモード

<div class="topic">AUTD3のアーキテクチャ in FPGA: Silencer</div>

<div class="flex sa">

![width:600](silencer_delta.svg)

<div>

- Silencerのニ種類のモード
  - Fixed Update Rateモード: $\Delta$が全振動子で固定
  - Fixed Completion Stepsモード: $\Delta T$が全振動子で固定

- $\Delta$が小さい, あるいは, $\Delta T$が大きいほど騒音は抑制される
  - 更新ステップは$25\,\mathrm{\micro s}$で固定

- Silencer内部では, より細かい制御を可能にするため, 強度$E$, 位相$P$を256倍している

</div>

---

## Modulation

<div class="topic">AUTD3のアーキテクチャ in FPGA</div>

<div class="flex sa">

![width:400](sig-gen-modulation.svg)

<div>

- 強度データ$E$に8bitの変調データ$M$をかけ合わせるモジュール
  - 正確には$\frac{E\times M}{255}$
  - これにより, Amplitude Modulationを実現する

- 変調データは最大長65536のメモリに書き込まれたデータが順次サンプルされる
  - データは$\frac{40\,\mathrm{kHz}}{d_\textrm{m}}$の周波数でサンプルされる (=この周波数で読み出しアドレスがインクリメントされる)

</div>

---

## STM

<div class="topic">AUTD3のアーキテクチャ in FPGA</div>

<div class="flex sa">

![width:400](sig-gen-stm.svg)

<div>

- 強度データ$E$と位相データ$P$を出力するモジュール

- STMデータもメモリに書き込まれたデータが順次サンプルされる
  - データは$\frac{40\,\mathrm{kHz}}{d_\textrm{s}}$の周波数でサンプルされる

- STMには2種類のモードがある
  - GainSTMモード: 書き込まれたデータをそのまま出力する
  - FociSTMモード: 書き込まれたデータを焦点列とみなす

</div>

---

## GainSTM

<div class="topic">AUTD3のアーキテクチャ in FPGA: STM</div>

<div class="flex sa">

![height:600](stm-gain.svg)

<div>

- $E_n[k]$: $k$番目のGainの$n$番目の振動子の強度データ
- $P_n[k]$: $k$番目のGainの$n$番目の振動子の位相データ

- このモードは柔軟だがメモリの使用量が大きい
  - メモリサイズ: $524288\,\mathrm{byte}$, 1Gainあたり強度位相に$2\,\mathrm{byte}\times 249$ → 最大で$\frac{524288}{2\times 249}=1052$個のGainを格納できる
  - 実際には切りよく1024個 ($k=1,2,...,1023$)

</div>

---

## FociSTM

<div class="topic">AUTD3のアーキテクチャ in FPGA: STM</div>

<div class="flex sa">

![height:600](stm-foci.svg)

<div>

- $F_x[k],F_y[k],F_z[k]$: $k$番目の焦点の座標データ
  - 具体的には, それぞれ18bitの符号あり固定小数点数 (単位$0.025\,\mathrm{mm}$)
- $E[k]$: $k$番目の焦点の強度データ
  - つまり, 全振動子で共通

- このモードは焦点しか出せないがメモリの使用量が少ない
  - メモリサイズ: $524288\,\mathrm{byte}$, 1焦点あたりに$18\times 3 + 8\,\mathrm{bit}$ → 最大で$\frac{524288\times 8}{18 \times 3 +8}=76260$個の焦点を格納できる
  - 実際には切りよく65536個 ($k=1,2,...,65535$)

</div>

---
 
## AUTD3の動作モデルまとめ

![width:1920](sig-gen.svg)

---

## 余談: Silencerによる位相変化抑制再考

<div class="flex fw">

<div style="--fw: 1;">

![width:300](silencer_dynamic.svg)
![width:300](silencer_delta.svg)

</div>

<div style="--fw: 3;">

- 途中でもう一度位相が変化する場合の挙動は, 移動平均フィルタとは異なる
  - 以下の条件を満たす場合, これが起きることはない
    - 変調のサンプリング周期$25\,\mathrm{\micro s}\times d_\mathrm{m} \ge \Delta T$
    - STMのサンプリング周期$25\,\mathrm{\micro s}\times d_\mathrm{s} \ge \Delta T$

- デフォルトでは上記の条件を満たさないようなサンプリング設定に対してエラーを返すようになっている
  - 位相に対して$\Delta T=1\,\mathrm{ms}$, 強度データに対して$\Delta T=0.25\,\mathrm{ms}$

</div>

</div>

---

## 複数デバイスの動作について

<div class="topic">あるいはEtherCATについて</div>

---

## EtherCAT

<div class="flex ss">

![height:500](autd3-arch-ethercat.svg)

<div>

- AUTD3は通信プロトコルにEtherCATを採用
- EtherCAT: Beckhoff社が開発したフィールドバスシステム
  - Ethernet上に構築
  - リアルタイム
  - 分散同期クロック (DC: Distributed Clock) を提供
    - 精度はsub-μsオーダー

</div>

</div>

---

## EtherCAT: 分散クロック

<div class="flex ss">

![width:500](ethercat-dc.svg)

<div>

- 一般に, クロック同士は同期しない
  - 同時にスタートできない
  - 周波数が微妙に違う

- データの送受信の際, その時刻を測定すると以下の関係が成り立つ$^1$
  - $t^2_r + t_\text{offset} = t^1_s + t_\text{delay}$
  - $t^1_r + t_\text{offset} = t^2_s + t_\text{delay}$

- これから$t^1$と$t^2$のクロックずれ $t_\text{offset}$ を求める
  - これを以て各デバイスのクロックずれを補正する$^2$

>>> 1: 通信ディレイ$t_\text{delay}$は送受信で同じと仮定
>>> 2: 実際には他にも色々やってる

</div>

</div>

---

## EtherCATの通信モデル

<div class="flex ss">

![height:500](autd3-arch-ethercat.svg)

<div>

- リング状になってる通信路上を固定長のフレームを常にぶん回すことで通信する
  - 各slaveはそのフレームをon-the-flyで処理
  - この処理のため特殊なESC (EtherCAT Slave Controller) が必要
- これによって, レイテンシを最小にしつつリアルタイム$^1$通信を実現
- EtherCAT masterは, 一定の間隔でフレームを送信することが求められる

>>> 1: リアルタイム: 所定の時間内に処理が完了すること

</div>

</div>

---

## TwinCAT: Beckhoff社のEtherCAT master

- EtherCATの本家であるBeckhoff社が提供しているEtherCAT master
- Windowsでのみ動作する$^1$
- Windows NTカーネルを拡張してリアルタイム性を実現しているらしい$^2$

>>> 1: 最近 (2024年4月) TwinCAT runtime for real-time Linuxが発表された. Q3 2025にリリース予定?
>>> 2: https://infosys.beckhoff.com/english.php?content=../content/1033/tcsystemover/12695813131.html&id=2075408258360613694

---

## SOEM: Simple Open EtherCAT Master

- Open sourceで開発されているEtherCAT master
  - TwinCAT以外だとほぼ唯一の選択肢$^1$
- 通常のWindows/Linux/macOS上で動作する
  - そのためリアルタイム性の保証はない

>>> 1: 最近, [EtherCrab](https://github.com/ethercrab-rs/ethercrab)という新しいEtherCAT masterが登場したものの, まだAUTD3がちゃんと動かなかった

---

## FPGA間の同期

<div class="flex ss">

![width:800](autd3-arch-cpu-fpga.svg)

<div>

- 基本的に, CPUボードからアクセスできるEtherCATのDCシステム時刻をFPGA側にコピーしている$^1$
  - EtherCATのDCシステム時刻の単位は$1\,\mathrm{ns}$, FPGA内部では$\frac{1}{20.48\,\mathrm{MHz}}$単位に変換$^2$

- PWM信号の生成や, STM/Modulationのサンプリングはこのシステム時刻を利用する
  - EtherCATのDCシステム時刻が同期しているので, これらも自動的に同期する

>>> 1: 実際にはもっと色々やってるけど割愛. [AUTD3のドキュメント](https://shinolab.github.io/autd3-doc/jp/Developer_Manual/fpga/sync.html)を参照.
>>> 2: $20.48\,\mathrm{MHz} = 512\times 40\,\mathrm{kHz}$

</div>

</div>

---

## FPGA間の同期: PWM

- PWM信号を生成するには, $t=0,1,2,...,T-1$を周期的にカウントするカウンタが必要になる
- これは, 同期システム時刻$t_\text{system}$に対して$t = t_\text{system}\ \mathrm{mod}\ 512$を計算すればいい$^1$
  - $a\ \mathrm{mod}\ b$は$a$を$b$で割った余り
- $t_\text{system}$が同期しているので, $t$も同期する

>>> 1: これは下位9bitを取り出す処理に等しい

---

## FPGA間の同期: STM/Modulation

- STM/Modulationのサンプリングは, そのインデックス$i$を$i = \left\lfloor\frac{t_\text{system}}{512 \times d}\right\rfloor\ \mathrm{mod}\ c$で計算すればいい
  - ここで, $d$はサンプリング分周比, $c$は周期
  - $i=0,1,2,...,c-1$まで, $\frac{20.48\,\mathrm{MHz}}{512 \times d}=\frac{40\,\mathrm{kHz}}{d}$の周波数で周期的にインクリメントされる 

---

## 複数デバイスの動作まとめ

<div class="flex ss">

![width:600](autd3-arch-summary.svg)

<div>

- 通信にはEtherCATを採用
  - 通信を制御するEtherCAT masterにはTwinCATとSOEMがある

- FPGAはEtherCATが提供するDCシステム時刻を利用して同期
  - PWM信号の生成や, STM/Modulationのサンプリングはこのシステム時刻を利用する
  - EtherCATのDCシステム時刻が同期しているので, これらも自動的に同期する

</div>

</div>

---

## 補足①: STM/Modulationのメモリセグメントについて

- STM/Modulationは同期のために, 周期的な動作を基本としている
  - STM/Modulationのサンプリングインデックス$i$は$i = \left\lfloor\frac{t_\text{system}}{512 \times d}\right\rfloor\ \mathrm{mod}\ c$で決定される

- そのため, 例えば, ある瞬間に「今から一周期分だけ出力してください」みたいな動作がこのままだとできない
  - 開始地点が制御できない

- これを実現するために, STM/Modulationのメモリには2つのセグメントが用意されており, このセグメントを切り替えるタイミングを制御することで, 上記のような動作を実現する

---

## セグメントの切り替え: SyncIdx

<div class="topic">補足①: STM/Modulationのメモリセグメントについて</div>


<div class="flex ss">

![width:600](sync_idx.gif)

<div>

- 遷移先セグメントのサンプリングインデックスが0になるタイミングで遷移するモード
- 待ち時間が発生する
- 命令のタイミングによっては, デバイス間で遷移タイミングが1周期分ずれる可能性あり

</div>


</div>

Segment 0からSegment 1への遷移

---

## セグメントの切り替え: SysTime + α

<div class="topic">補足①: STM/Modulationのメモリセグメントについて</div>

- SysTime
  - 所定のEtherCATシステム時間に遷移するモード$^1$
  - 余裕を持った未来のタイミングを指定しないと失敗する可能性あり

- GPIOIn
  - GPIOピンへの入力をトリガに遷移するモード

- Ext
  - 2つのセグメント間を自動で切り替えるモード

>>> 1: システム時間がわかれば, オフセットも計算できる

---

## 補足②: 冷却用ファン


<div class="flex ss">

![width:600](fan.jpg)

<div>

- ファン横のジャンパスイッチでモードを切り替えられる
  - 図左: Auto (温度センサで制御)
  - 図中: 常時OFF
  - 図右: 常時ON

- Autoモードの場合, 一定温度を超えるとファンが回る
  - あるいは, ForceFan信号で強制的にOnにできる$^1$

</div>

</div>

>>> 1: 強制Offはできない

---

## 補足③: GPIOピン

<div class="flex ss">

![width:600](gpio_pin.jpg)

<div>

- 4入力4出力のGPIOピンがある
- 入力は現在, セグメントの切り替えトリガにしか使ってない
- 出力としては, 指定した振動子の駆動信号等を出力できる$^1$

</div>

</div>

>>> 1: 詳細は[ドキュメント](https://shinolab.github.io/autd3-doc/jp/Users_Manual/API/gpio_out.html)を参照

---

## autd3ソフトウェアライブラリについて

---

## autd3ソフトウェアライブラリ

- 実装はすべてRustで書かれている
- 多言語から扱えるように, 上記の実装をC APIとしてラップしたものも提供
  - これをPython, .NET (C#/Unity等), C++用にラップしたライブラリも提供
  - RustのAPIとの一貫性を重視, パフォーマンスは二の次
  - 一部機能は利用不可$^1$

>>> 1: 面倒なので

---

## autd3ソフトウェアライブラリの依存関係

![width:860](software.svg)

>>> autd3-link-soem, 及び, そのラッパーを分けているのは, SOEMがGPLライセンスなので (例外付きなので大丈夫だとは思うが念の為)

---

## autd3ライブラリの主要コンポーネント
