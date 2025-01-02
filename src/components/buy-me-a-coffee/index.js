import { graphql, useStaticQuery } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import kakaoIcon from '@/assets/kakao_icon.svg';
import tossIcon from '@/assets/toss_icon.svg';
import Image from '../Image';
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
              }
              kakaopay {
                qrCode
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

  useEffect(() => {
    setHtml(document.querySelector('html'));
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