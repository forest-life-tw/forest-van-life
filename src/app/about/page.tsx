import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";
import ConsultationBrief from "@/components/ConsultationBrief";
import bedPhoto from "../../../public/consultation/interior-bed.jpg";
import livingPhoto from "../../../public/consultation/interior-living.jpg";
import styles from "./consultation.module.css";

export const metadata = pageMetadata("/about", "客製露營車改裝諮詢與團隊介紹", "從車型與生活需求開始，與森活家討論全車客製、單項升級、配件安裝與車室配置。");

function splitCopy(value: string) {
  const [title, ...description] = value.split("｜");
  return { title, text: description.join("｜") };
}
const questions = [
  ["可以只做一項改裝嗎？", "可以。除了全車裝潢，森活家也提供冷氣、床椅、窗簾軟裝、電池更換等單項改裝。實際施作需先確認車型與現有配置。"],
  ["諮詢前需要準備什麼？", "先提供車型、使用人數、主要用途，以及這次想改善的地方即可。有現況照片或喜歡的案例，也可以一起放進 LINE 對話。"],
  ["改裝價格怎麼確認？", "依車型、選用配置與施工範圍確認報價；先釐清這次要做的內容，再討論費用與安排。"],
  ["一定要先填需求表嗎？", "不用。可以直接透過 LINE 聯繫；需求整理區只是幫你先整理想說的內容，不會自動傳送。"],
];

export default function AboutPage() {
  const config = getSiteConfig();
  const { lineUrl, address, businessHours } = config.contact;
  const serviceDetails = config.about.services.map(splitCopy);
  const process = config.about.consultationSteps.map(splitCopy);
  const lineButton = (label: string) => <a className={styles.btn} href={lineUrl} target="_blank" rel="noopener noreferrer">{label} ↗</a>;
  return <div className={styles.page}>
    <section className={styles.hero}><div className={`${styles.wrap} ${styles.heroLayout}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>CUSTOM CAMPER / 森活家露營車</p>
        <h1>把你的生活，<br />放進車裡。</h1>
        <p>從木作、軟裝到設備配置，<br />先聊你怎麼用車，再一起討論怎麼改。</p>
        <div className={styles.actions}>{lineButton("開始改裝諮詢")}<a className={`${styles.btn} ${styles.light}`} href="#cases">先看看車室實例 ↓</a></div>
        <div className={styles.tags}><span>全車客製</span><span>單項升級</span><span>配件安裝</span></div>
      </div>
      <figure className={styles.photo}>
        <Image src={bedPhoto} alt="森活家完工車室，從車尾可見床面、兩側櫃體與暖色照明" sizes="(max-width:760px) calc(100vw - 40px), (max-width:1344px) 54vw, 680px" preload />
        <figcaption className={styles.caption}><span>木作、床面與照明的整體安排</span><span>FOREST / INTERIOR</span></figcaption>
      </figure>
    </div></section>
    <section className={styles.intro}><div className={`${styles.wrap} ${styles.introInner}`}>
      <h2>配置，從你的日常開始。</h2><p>睡眠、乘坐、收納與設備，每台車的使用方式都不同。無論是整車裝潢，或只想調整一個細節，都可以先從車型與需求聊起。</p>
    </div></section>
    <section id="services" className={styles.section}><div className={styles.wrap}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / 改裝方向</p><h2>整體規劃，<br />也照顧單項細節。</h2></div><p>依車型、現有配置與這次想做的項目，討論適合的改裝方向。</p></div>
      <div className={styles.services}>{serviceDetails.map((service, i) => <article className={styles.service} key={service.title}><span className={styles.number}>0{i + 1}</span><h3>{service.title}</h3><p>{service.text}</p></article>)}</div>
    </div></section>
    <section id="cases" className={`${styles.section} ${styles.caseSection}`}><div className={`${styles.wrap} ${styles.caseLayout}`}>
      <figure className={styles.photo}><Image src={livingPhoto} alt="森活家完工車室側門視角，可見乘坐區、木作桌面、櫃體與燈光" sizes="(max-width:760px) calc(100vw - 40px), (max-width:1344px) 54vw, 680px" /><figcaption className={styles.caption}>森活家完工車室實例；配置依個案需求調整。</figcaption></figure>
      <div><p className={styles.eyebrow}>02 / 車室實例</p><h2>把材質、光線<br />與日常放在一起。</h2><p>一張桌面、乘坐的位置、窗邊與腳下的安排，會一起影響車內的使用感受。改裝時，除了各項設備，也值得把整個空間放在一起看。</p><div className={styles.caseDetails}><span>木作配置</span><span>乘坐與使用</span><span>照明層次</span></div><div className={styles.caseDetails}><Link href="/cars">看各車型改裝方向 →</Link></div></div>
    </div></section>
    <section id="process" className={styles.section}><div className={styles.wrap}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / 怎麼開始</p><h2>先聊清楚，<br />再決定怎麼做。</h2></div><p>不用一次準備完整設計。先從車型與最在意的需求開始。</p></div>
      <div className={styles.steps}>{process.map((step, i) => <article className={styles.step} key={step.title}><span className={styles.number}>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    </div></section>
    <section id="team" className={styles.section}><div className={styles.wrap}>
      <p className={styles.eyebrow}>ABOUT / 森活家施工團隊</p><h2>從實際施工，<br />累積每一次配置的經驗。</h2>
      <div className={styles.introInner} style={{ marginTop: 32 }}>{config.about.intro.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
      <div className={styles.models}>{config.cars.map(car => <Link key={car.slug} href={`/cars/${car.slug}`}>{car.name} ↗</Link>)}</div>
    </div></section>
    <section id="contact" className={`${styles.section} ${styles.consult}`}><div className={`${styles.wrap} ${styles.consultGrid}`}>
      <div><p className={styles.eyebrow}>04 / 準備聊聊</p><h2 style={{ whiteSpace: "pre-line" }}>{config.about.consultationTitle}</h2><p className={styles.consultCopy}>{config.about.consultationDesc}</p>{lineButton("直接開啟 LINE")}<div className={styles.contactInfo}>{address && <p>地址：{address}</p>}{businessHours && <p>營業時間：{businessHours}</p>}</div></div>
      <ConsultationBrief />
    </div></section>
    <section id="faq" className={styles.section}><div className={`${styles.wrap} ${styles.faq}`}><p className={styles.eyebrow}>05 / 常見問題</p><h2>先回答幾個問題。</h2>{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className={styles.closing}><h2>你的下一趟出發，<br />想帶上什麼樣的日常？</h2><p>從車型、生活方式與這次想做的事開始聊。</p>{lineButton("與森活家聊聊")}</section>
  </div>;
}
