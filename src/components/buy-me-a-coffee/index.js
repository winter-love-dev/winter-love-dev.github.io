import { graphql, useStaticQuery } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconButton, Tooltip } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
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
  const [zoomedQR, setZoomedQR] = useState(null); // 'kakao' | 'toss' | null

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

  const handleZoomQR = (type) => {
    setZoomedQR(type);
  };

  const closeZoomQR = () => {
    setZoomedQR(null);
  };

  return (
    <>
      <div className="buy-me-coffee-button" onClick={openModal}>
        <div className="buy-me-coffee-text">
          {'Support My Work ☕️'.split('').map((char, index, array) => {
            const visibleCharsBeforeThis = array.slice(0, index).filter(c => c !== ' ').length;
            const isOdd = visibleCharsBeforeThis % 2 === 0; // 0부터 시작하므로 짝수가 홀수번째

            return (
              <p key={index} className={isOdd ? 'color-odd' : 'color-even'}>
                {char}
              </p>
            );
          })}
        </div>
      </div>

      {isModalOpened &&
        createPortal(
          <div className="modal-background" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="buy-me-coffee-title">Support my work ☕️</div>
              <div className="content">
                <div className="payment-groups">
                  {/* 카카오 그룹 */}
                  {kakaopay.qrCode && (
                    <div className="payment-group">
                      <div className="payment-group__qr">
                        <div className="payment-group__icon-row">
                          <img src={kakaoIcon} alt="kakao" />
                          <Tooltip title="확대" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleZoomQR('kakao')}
                              className="qr-zoom-button"
                            >
                              <ZoomInIcon className="qr-zoom-icon" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <Image alt="kakaopay" src={kakaopay.qrCode} />
                      </div>
                      {isMobile && (
                        <div className="deep-link-button deep-link-button--kakao"
                          onClick={() => window.open(kakaopay.qrText, '_blank', 'noopener noreferrer')}>
                          <p className="p">카카오로<br/>송금하기</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 토스 그룹 */}
                  {toss.qrCode && (
                    <div className="payment-group">
                      <div className="payment-group__qr">
                        <div className="payment-group__icon-row">
                          <img src={tossIcon} alt="toss" />
                          <Tooltip title="확대" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleZoomQR('toss')}
                              className="qr-zoom-button"
                            >
                              <ZoomInIcon className="qr-zoom-icon" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <Image alt="toss" src={toss.qrCode} />
                      </div>
                      {isMobile && (
                        <div className="deep-link-button deep-link-button--toss"
                          onClick={() => window.open(toss.qrText, '_blank', 'noopener noreferrer')}>
                          <p className="p">토스로<br/>송금하기</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* QR 확대 모달 */}
      {zoomedQR &&
        createPortal(
          <div className="qr-zoom-modal" onClick={closeZoomQR}>
            <div className="qr-zoom-modal__content" onClick={(e) => e.stopPropagation()}>
              <Image
                alt={zoomedQR === 'kakao' ? 'kakaopay-large' : 'toss-large'}
                src={zoomedQR === 'kakao' ? kakaopay.qrCode : toss.qrCode}
                className="qr-zoom-modal__image"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default BuyMeACoffee;
