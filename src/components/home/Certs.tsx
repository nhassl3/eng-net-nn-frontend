import { CERTS } from '../../data/certs'
import { useAppDispatch } from '../../store/hooks'
import { openCertsModal } from '../../store/slices/modalSlice'

export function Certs() {
  const dispatch = useAppDispatch();

  return (
    <section id="certificates" className="section-pad-sm reveal">
      <div className="container">
        <div className="sec-head">
          <div>
            <span className="kicker"><span className="num">[04]</span> Сертификаты и лицензии</span>
            <h2>Допуски, без которых не пускают на стройплощадку.</h2>
          </div>
          <p className="lede">
            Полный пакет разрешительной документации, аттестация инженеров, регулярный аудит систем менеджмента.
            Свидетельства предоставляем по запросу.
          </p>
        </div>

        <div className="certs">
          {CERTS.map((c) => (
            <div className="cert" key={c.idx} onClick={() => dispatch(openCertsModal(c.idx))}>
              <img className="cert-bg" src={c.img} alt={c.t} loading="lazy" />
              <div className="seal" style={{ whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.1 }}>
                {c.seal}
              </div>
              <div>
                <h4>{c.t}</h4>
                <div className="meta">{c.m}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
