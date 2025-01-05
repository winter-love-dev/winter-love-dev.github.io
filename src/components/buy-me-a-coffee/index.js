import { graphql, useStaticQuery } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import kakaoIcon from '@/assets/icon_kakao.svg';
import tossIcon from '@/assets/icon_toss.svg';
import Image from '../image';
import './style.scss';

const BuyMeACoffee = () => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            remittances {
              toss {
                qrCode
                qrText
              }
              kakaopay {
                qrCode
                qrText
              }
            }
          }
        }
      }
    `,
  );

  const remittance = site.siteMetadata.remittances;
  const { toss, kakaopay } = remittance;

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [html, setHtml] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setHtml(document.querySelector('html'));

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openModal = () => {
    setIsModalOpened(true);
    html?.classList.add('scroll-locked');
  };

  const closeModal = () => {
    setIsModalOpened(false);
    html?.classList.remove('scroll-locked');
  };

  return (
    <>
      <div className="buy-me-coffee-button" onClick={openModal}>
        <div className="buy-me-coffee-text">
          {'BuyMeACoffee ☕️'.split('').map((char, index) => (
            <p key={index}>{char}</p>
          ))}
        </div>
      </div>

      {isModalOpened &&
        createPortal(
          <div className="modal-background" onClick={closeModal}>
            <div className="modal">
              <div className="buy-me-coffee-title">Buy Me A Coffee ☕️</div>
              <div className="content">
                <div className="list">
                  <div>송금 QR</div>
                  <div className="qr">
                    {kakaopay.qrCode && (
                      <div>
                        <img src={kakaoIcon} />
                        <Image alt="kakaopay" src={kakaopay.qrCode} />
                      </div>
                    )}
                    {toss.qrCode && (
                      <div>
                        <img src={tossIcon} />
                        <Image alt="toss" src={toss.qrCode} />
                      </div>
                    )}
                  </div>
                  {isMobile && (
                    <div className="mobile-links">
                      <div className="deep-link-button"
                        onClick={() => window.open(kakaopay.qrText, '_blank', 'noopener noreferrer')}>
                        <p className="p">카카오로 송금하기</p>
                      </div>
                      <div className="deep-link-button"
                        onClick={() => window.open(toss.qrText, '_blank', 'noopener noreferrer')}>
                        <p className="p">토스로  송금하기</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default BuyMeACoffee;
