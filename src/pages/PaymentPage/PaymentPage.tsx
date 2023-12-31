import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  PaymentContainer,
  RightSection,
  LeftSection,
  PaymentSection,
} from './PaymentPageStyle';
import ClassBack from '../../assets/images/payment/ClassBack.png';
import ClassBoys from '../../assets/images/payment/ClassBoys.png';
import Button from '../../components/Button.tsx';
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { appFireStore, Timestamp } from '../../firebase/config';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PayContext } from '../../context/PayContext';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext.ts';
import StyledDialog from './StyledDialog';
import closeIcon from '../../assets/icons/x-black.svg';
import checkCheckedIcon from '../../assets/icons/check-checked.svg';
import checkIcon from '../../assets/icons/check.svg';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [ablePay, setAblePay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { openTime, setOpenTime } = useContext(PayContext);
  const { user } = useAuthContext();
  const modal = useRef<HTMLDialogElement | null>(null);

  const uid = user?.uid || null;
  const displayName = user?.displayName || null;

  useEffect(() => {
    const setTitle = () => {
      const titleElement = document.getElementsByTagName('title')[0];
      titleElement.innerHTML = '결제 | LUPIN';
    };
    setTitle();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isModalOpen && modal.current) {
      modal.current.showModal();
    }
  }, [isModalOpen]);

  const postData = async () => {
    const colRef = collection(appFireStore, 'Ranking_' + openTime);
    try {
      const myTime = Timestamp.fromDate(new Date());
      await addDoc(colRef, { myTime, displayName, uid });
      navigate('/ranking');
    } catch (error) {
      console.error(error);
    }
  };
  // 결제하기
  const handleBuyBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    target.disabled = true; // 더블 클릭 방지
    postData();
  };

  // 버튼 활성화
  const checkPaid = (iso: string) => {
    onSnapshot(
      collection(appFireStore, 'Ranking_' + iso),
      (snapshot) => {
        // 결제 이력 검사
        for (const doc of snapshot.docs) {
          if (uid === doc.data().uid) {
            return;
          }
        }
        // context에 저장
        localStorage.setItem('openTime', iso);
        setOpenTime(iso);

        // 버튼 활성화
        setAblePay(true);
      },
      (error) => {
        console.error(error.message);
      }
    );
  };

  useEffect(() => {
    (async () => {
      const openedTimeList: string[] = [];
      const currTime = new Date();
      const currTimeCopy = new Date(currTime);
      const q = query(
        collection(appFireStore, 'time'),
        where(
          'time',
          '>=',
          new Date(currTimeCopy.setMinutes(currTimeCopy.getMinutes() - 10))
        )
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((document) => {
        const date = new Date(document.data().time.seconds * 1000);

        // 오픈 예정 시간 <= 현재 시간
        if (date <= currTime) {
          const dateCopy = new Date(date);
          const iso = new Date(dateCopy.setHours(dateCopy.getHours() + 9))
            .toISOString()
            .slice(0, 16);
          openedTimeList.push(iso);
        }
      });

      if (openedTimeList.length) {
        checkPaid(openedTimeList[openedTimeList.length - 1]);
      }
    })();
  }, []);

  const handlePaySelectBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    const sibling = e.currentTarget.parentNode?.children;
    if (sibling) {
      [...sibling].forEach((el) => el.classList.remove('selected'));
    }
    e.currentTarget.classList.add('selected');
  };

  return (
    <>
      <Header />
      <PaymentContainer>
        <h2 className="a11y-hidden">주문결제</h2>
        <h1>주문결제</h1>
        <div className="leftBox">
          <LeftSection>
            <div className="classCategory">
              <div className="imgBox">
                <img className="classBack" src={ClassBack} alt="루팡기초반" />
                <div className="imgText">
                  <img className="classBoys" src={ClassBoys} alt="루팡기초반" />
                  <p className="basicText">루팡스쿨 기초반</p>
                </div>
              </div>
              <div className="classInfo">
                <p>[루팡스쿨 기초반] 월급을 잘 투자하는 법</p>
                <p className="classPrice">월 9,900 원</p>
              </div>
            </div>
          </LeftSection>
          <RightSection>
            <h3 className="smallTitle">결제금액</h3>
            <div className="payBox">
              <ul className="payCost">
                <li>
                  <p>총 강의 금액</p>
                  <strong>118,800 원</strong>
                </li>
                <li>
                  <p>총 강의 금액</p>
                  <span>118,800 원</span>
                </li>
                <li>
                  <p>총 강의 금액</p>
                  <span>0 원</span>
                </li>
              </ul>
              <div className="totalCost">
                <p>총 결제금액</p>
                <span>118,800 원</span>
              </div>
              <span className="installmentInfo">12개월 할부 시 월 9,900원</span>
            </div>
            <Button
              className="payBtn"
              size="l"
              onClick={() => {
                if (!isModalOpen) {
                  setIsModalOpen(true);
                }
              }}
              disabled={!ablePay || isModalOpen}
            >
              결제하기
            </Button>
          </RightSection>
          <PaymentSection>
            <div className="payBenefit">
              <h2 className="a11y-hidden">쿠폰</h2>
              <h3 className="smallTitle">쿠폰</h3>
              <p className="pointBox">사용가능한 쿠폰이 없습니다.</p>
            </div>
            <div className="payBenefit">
              <h2 className="a11y-hidden">포인트</h2>
              <h3 className="smallTitle">포인트</h3>
              <div className="payPoint">
                <p className="pointBox">0</p>
                <button className="payAllBtn" type="submit">
                  전액사용
                </button>
              </div>
            </div>
            <div className="payBenefit">
              <h2 className="a11y-hidden">결제수단</h2>
              <h3 className="smallTitle">결제수단</h3>
              <div className="paySelect">
                <button
                  className="paySelectBtn selected"
                  type="button"
                  disabled={!ablePay}
                  onClick={handlePaySelectBtn}
                >
                  신용카드
                </button>
                <button
                  className="paySelectBtn"
                  type="button"
                  disabled={!ablePay}
                  onClick={handlePaySelectBtn}
                >
                  A페이
                </button>
                <button
                  className="paySelectBtn"
                  type="button"
                  disabled={!ablePay}
                  onClick={handlePaySelectBtn}
                >
                  B페이
                </button>
                <button
                  className="paySelectBtn"
                  type="button"
                  disabled={!ablePay}
                  onClick={handlePaySelectBtn}
                >
                  C페이
                </button>
              </div>
            </div>
          </PaymentSection>
        </div>
        <div className="mobileStickyBtn">
          <Button
            className="mobilePayBtn"
            size="l"
            onClick={() => setIsModalOpen(true)}
            disabled={!ablePay || isModalOpen}
          >
            결제하기
          </Button>
        </div>
      </PaymentContainer>

      {isModalOpen && (
        <StyledDialog
          ref={modal}
          $checkCheckedIcon={checkCheckedIcon}
          $checkIcon={checkIcon}
        >
          <span className="name">LUPIN</span>
          <dl>
            <div>
              <dt>상품명</dt>
              <dd>: 월급을 잘 투자하는 법</dd>
            </div>
            <dt className="price">상품금액</dt>
            <dd>: 118,800</dd>
            <dt className="total">최종 결제 금액</dt>
            <dd className="totalPrice">: 118,800</dd>
          </dl>
          <div className="box">
            <label htmlFor="checkbox">약관 및 이용동의</label>
            <input
              id="checkbox"
              type="checkbox"
              onChange={(e) => setIsAgreed(e.target.checked)}
              aria-describedby="agreeAll"
              onKeyDown={(e) => {
                // 32 === 스페이스바
                if (e.key === ' ' || e.key === 'Enter') {
                  e.currentTarget.click();
                }
              }}
            />
            <span id="agreeAll">전체동의</span>
          </div>
          <p className="notification">
            *수강신청 연습용 결제 페이지로 실제 결제를 비롯한 어떠한 효력도
            발생하지 않는 페이지 입니다.
          </p>
          <Button
            size="m"
            onClick={handleBuyBtn}
            disabled={!isAgreed || !ablePay}
            className="pay-btn"
          >
            결제하기
          </Button>
          <button onClick={() => setIsModalOpen(false)} className="close-btn">
            <img src={closeIcon} alt="닫기" />
          </button>
        </StyledDialog>
      )}
      <Footer />
    </>
  );
};

export default PaymentPage;
