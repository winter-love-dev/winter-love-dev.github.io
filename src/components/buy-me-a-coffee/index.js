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
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부를 추적하는 상태 추가

  useEffect(() => {
    setHtml(document.querySelector('html'));

    // 화면 크기 체크하여 모바일 여부 설정
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px 이하를 모바일로 간주
    };

    handleResize(); // 컴포넌트 마운트 시 한번 실행
    window.addEventListener('resize', handleResize); // 화면 크기 변화에 따른 이벤트 리스너 추가

    return () => {
      window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
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
                      <div className="deep-link-button">
                        <a href={kakaopay.qrText} className="a" target="_blank" rel="noopener noreferrer">
                          <p className="p">카카오로 송금하기</p>
                        </a>
                      </div>
                      <div className="deep-link-button">
                        <a href={toss.qrText} className="a" target="_blank" rel="noopener noreferrer">
                          <p className="p">토스로 송금하기</p>
                        </a>
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
