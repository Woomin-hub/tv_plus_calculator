import { useState, useEffect } from 'react';
import { e } from 'vite-node/dist/index.d-DGmxD2U7.js';

const PROVIDERS = ['LGU+', 'KT'] as const; // 추후 필요 시 SKB 추가
  type ProviderType = (typeof PROVIDERS)[number];

const INTERNET_TYPES = ['500MB', '1GB'] as const;
  type InternetType = (typeof INTERNET_TYPES)[number];

const INTERNET_PRICES: Record<ProviderType, Record<InternetType, number>> = {
  'LGU+': {
    '500MB': 35000,
    '1GB': 40000,
  },
  KT: {
    '500MB': 25000,
    '1GB': 30000,
  },
};

const SETTOP_PRICES = {
  'LGU+': {
    UHD: 1500,
    HD: 0,
  },
  KT: {
    UHD: 3000, // HD는 없음
  },
} as const;
type SettopPriceMap = typeof SETTOP_PRICES;
type SettopType = 'UHD' | 'HD';




export default function App() {
  const [tvCount, setTvCount] = useState(0);
  const [equipmentType, setEquipmentType] = useState('tvG');
  const [isCalculated, setIsCalculated] = useState(false);
  const [result, setResult] = useState({ total: 0, withTax: 0, lineCount: 0, linePrice: 0, equipmentPrice: 0, settopPrice: 0, installFee: 0, });
  const [provider, setProvider] = useState<ProviderType>('LGU+');
  const [settopType, setSettopType] = useState<SettopType>('UHD');
  const [internetType, setInternetType] = useState<InternetType>('500MB');
  
  const internetPrice = INTERNET_PRICES[provider][internetType];
  const providerSettopPrices = SETTOP_PRICES[provider];
  const unitSettopPrice = providerSettopPrices[settopType as keyof typeof providerSettopPrices];


  // 계산 로직
  const calculatePrice = () => {
    if (tvCount <= 0) return { total: 0, withTax: 0, lineCount: 0, linePrice: 0, equipmentPrice: 0, settopPrice: 0, installFee: 0, };
    
    // 회선 수 = TV 수 / 8 (올림)
    const lineCount = Math.ceil(tvCount / 8);
    const linePrice = lineCount * INTERNET_PRICES[provider][internetType];
    
    // 채널 이용료
    let channelFee = 0;

    if (provider === 'LGU+') {
      channelFee = tvCount * 5900; // 250716 부로 변경예정
    } else if (provider === 'KT') {
      const mainDeviceFee = lineCount * 12000 ;
      const subDeviceCount = Math.max(0, tvCount - lineCount)
      let subDeviceFee = subDeviceCount * 7400 ;

      if (subDeviceCount > 30) {
        subDeviceFee *= 0.9;
      }

      channelFee = mainDeviceFee + subDeviceFee;
    }
    
    // 셋톱 임대료
    let settopPrice = 0;
    if (provider === 'LGU+' && settopType === 'UHD') {
      settopPrice = tvCount > 50 ? 0 : tvCount * unitSettopPrice;
    } else if (settopType === 'UHD') {
      settopPrice = tvCount * unitSettopPrice;
    // LGU+ UHD만 TV 수가 50개 넘으면 면제  
      
    } else if (settopType === 'HD') {
      settopPrice = 0; // 무료
    }

    // 설치비

    let installFee = 0;

    if (provider === 'KT') {
      const subDeviceCount = Math.max(0, tvCount - lineCount);

      // 인터넷 설치비
      installFee += 32000; // 최초 회선
      if (lineCount > 1) {
        installFee += (lineCount - 1) * 20000; // 나머지 회선
      }

      // 메인단말 설치비
      installFee += lineCount * 22000;

      // 서브단말 설치비
      installFee += subDeviceCount * 14000;
    } else if (provider === 'LGU+') {
      installFee = 0;
    }
  
    
    const total = channelFee + settopPrice + linePrice;
    const withTax = Math.floor(total * 1.1);
    
    return { total, withTax, lineCount, linePrice, equipmentPrice: channelFee, settopPrice, installFee };
  };
  
  // 계산하기 버튼 클릭 핸들러
  const handleCalculate = () => {
    const calculatedResult = calculatePrice();
    setResult(calculatedResult);
    setIsCalculated(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-2 pb-8 px-4">
      <div className="max-w-2xl mx-auto">



        {/* 배너 이미지 */}
        <img
          src="/banner.png"
          alt="티비넷 배너"
          className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
        />
        
        {/* 메인 폼 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-blue-600">
            아도나이x티비넷
            </span>{" "}
            <span className="text-gray-800">
            고객 전용 계산기
            </span>
          </h1>
          <p className="text-gray-600">
            필요하신 TV 수량과 옵션을 선택하여 월 요금을 계산해보세요
          </p>
        </div>

          {/* TV 수 입력 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              TV 대수
            </label>
            <input
              type="number"
              min="0"
              value={tvCount || ''}
              onChange={(e) => setTvCount(parseInt(e.target.value) || 0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCalculate();
                }
              }}
              placeholder="TV 대수를 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            />
          </div>
          
          {/* 통신사 선택 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              통신사 선택
            </label>
            <div className="flex gap-4">
              {PROVIDERS.map((type) => (
                <button
                  key={type}
                  onClick={() => setProvider(type)}
                  className={`px-6 py-3 rounded-lg border-2 font-medium transition 
                    ${provider === type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

           {/* 인터넷 선택 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              인터넷 회선 <span className="text-green-600 font-semibold">(TV 대수 8대당 1회선 과금)</span>
            </label>
            <div className="space-y-3">
              {INTERNET_TYPES.map((type) => (
                <label key={type} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="internet"
                    value={type}
                    checked={internetType === type}
                    onChange={(e) => setInternetType(e.target.value as InternetType)}
                    className="w-5 h-5 text-blue-600 mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{type}</div>
                    <div className="text-sm text-gray-600">
                      {INTERNET_PRICES[provider][type].toLocaleString()}원
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 채널 이용료 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
               채널 이용료
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="equipment"
                  value="tvG"
                  checked={equipmentType === 'tvG'}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="w-5 h-5 text-blue-600 mr-3"
                />
                <div>
                  {provider === 'LGU+' ? (
                    <>
                    <div className="font-medium text-gray-800">기업 IPTV 일반형 (190여개 채널)</div>
                    <div className="text-sm text-gray-600">TV 당 5,900원</div>
                    <span className="text-sm text-green-600 font-semibold">※ 7/16일부터 요금제가 변경됩니다: 실속형 7,000원 (219채널) </span>
                    </>
                  ) : provider === 'KT' ? (
                    <>
                    <div className="font-medium text-gray-800">지니TV (230여개 채널)</div>
                    <div className="text-sm text-gray-600">
                      메인단말 TV: 12,000원<br />
                      서브단말 TV : 7,400원
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      ※ 메인단말 대수는 인터넷 회선수와 동일 / 나머지는 서브단말 사용 <br />
                       (서브단말 30대 초과 시 10% 공청 할인 적용됨)
                      
                    </div>
                    </>
                  ) : null}
                </div>
              </label>
            </div>
          </div>
          
          {/* 셋톱 임대료 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              셋톱 임대료
            </label>
            <div className="space-y-3">
              {Object.entries(SETTOP_PRICES[provider]).map(([type, price]) => (
                <label key={type} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="settop"
                    value={type}
                    checked={settopType === type}
                    onChange={(e) => setSettopType(e.target.value as SettopType)}
                    className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">{type} 셋톱</div>
                    <div className="text-sm text-gray-600">
                      {price.toLocaleString()}원
                      {provider === 'LGU+' && type === 'UHD' && (
                        <span className="text-green-600 font-semibold">(50대 초과시 면제)</span>
                      )} 
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 설치비 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              인터넷, TV 설치비
            </label>
            <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="install"
                    className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    {provider === 'LGU+' ? (
                      <>
                        <div className="font-medium text-gray-800">설치비 없음</div>
                        <div className="text-sm text-gray-600">전액 면제</div>
                      </>
                    ) : provider === 'KT' ? (
                      <>
                        <div className="font-medium text-gray-800">KT 설치비 (최초 1회 청구)</div>
                        <div className="text-sm text-gray-600">
                          인터넷 회선: 32,000원(1회선), 이후 20,000원/회선<br />
                          메인단말: 22,000원 / 서브단말: 14,000원
                    </div>
                      </>
                    ) : null }
                  </div>
                </label>
            </div>
          </div>
          
          {/* 기본혜택 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              기본혜택
            </label>
            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base font-medium text-gray-800">
              {provider === 'LGU+' ? (
                <>
                  와이파이 무상 제공<br />
                  성인방송 비키 무상 제공<br />
                  기타 U+ 전용 혜택 내용 기입하기<br />
                </>
              ) : provider === 'KT' ? (
                <>
                  와이파이 무상 제공<br />
                  성인방송 비키 무상 제공<br />
                  기타 KT 전용 혜택 내용 기입하기<br />
                </>
              ) : (
                <span className="text-red-700 font-semibold">
                  통신사를 선택하면 혜택이 표시됩니다.
                </span>
              )}
            </div>
          </div>

          {/* 계산하기 버튼 */}
          <div className="text-center">
            <button
              onClick={handleCalculate}
              disabled={tvCount <= 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
               계산하기
            </button>
          </div>
          
          {/* 계산 상세 내역 */}
          {isCalculated && tvCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4"> 계산 내역</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>회선 수 (TV 8대당 1회선 과금)</span>
                  <span>{result.lineCount}회선</span>
                </div>
                <div className="flex justify-between">
                  <span>회선 요금 ({result.lineCount}회선 × {INTERNET_PRICES[provider][internetType].toLocaleString()}원)</span>
                  <span>{result.linePrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {provider === 'LGU+' ? (
                      <>채널 이용료 ({tvCount}개 × 5,900원)</>
                    ) : provider === 'KT' ? (
                      <>
                      채널 이용료 (메인단말: {result.lineCount}개 x 12,000원 + 서브단말: {tvCount - result.lineCount}개 x {''}
                      {(tvCount - result.lineCount) > 30 ? '6,660원' : '7,400원'})<br />
                      {tvCount - result.lineCount > 30 && (
                        <span className="text-green-600 font-semibold">※ 30대 초과 공청할인 10% 적용됨</span>
                      )}
                      </>
                    ) : null}
                    </span>
                  <span>{result.equipmentPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>셋톱 임대료 ({tvCount}개 × {result.settopPrice/tvCount}원)</span>
                  <span>{result.settopPrice.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between">
                <span>
                  설치비
                  {provider === 'KT' && (
                    <>
                      {' '} (인터넷: 1회선 32,000원 + 추가 {result.lineCount - 1}회선 × 20,000원,<br />
                      메인단말 {result.lineCount}개 × 22,000원, 서브단말 {tvCount - result.lineCount}개 × 14,000원)
                    </>
                  )}
                  {provider === 'LGU+' && ' (면제)'}
                </span>
                <span>{result.installFee.toLocaleString()}원</span>
              </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 결과 표시 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {isCalculated ? (
            <div className="mb-4">
              <div className="text-xl font-bold text-gray-800 mb-2">
                 TV 대수 당 요금: {Math.round(result.total / tvCount).toLocaleString()}원
              </div>
              <div className="text-xl font-bold text-gray-800 mb-2">
                 TV 대수 당 요금(vat 포함):  {Math.round(result.withTax / tvCount).toLocaleString()}원 
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                 총 요금: {result.total.toLocaleString()}원
              </div>
              <div className="text-2xl font-semibold text-blue-600">
                 총 요금(vat 포함): {result.withTax.toLocaleString()}원
              </div>
              <div className="text-center mt-8 text-gray-800 text-base leading-relaxed">
                <p>※ 상기 금액은 월 요금 기준이며, 더 많은 혜택과 자세한 상담을 원하실 시 연락주세요.</p>

                {provider === 'KT' && (
                  <span className="text-center mt-8 text-gray-800 text-base leading-relaxed underline">
                    ※ KT의 경우 상기 설치비 {result.installFee.toLocaleString()}원(vat 별도)이 1회차 요금에 합산 적용됩니다.
                  </span>
                )}
              </div>
              <div className="text-center mt-8 text-gray-800 text-base leading-relaxed">
                <p>
                  티비넷 대표 박덕진 010-2700-9421 <br /><br />
                  <a href="tel:01027009421" className="font-semibold text-blue-600">
                    전화하기
                  </a>
                </p>
                <p> <a href="https://naver.me/5dA6ddov" className="font-semibold text-blue-600">상담예약하기</a></p>
              </div>
              <div className="text-center mt-8 text-gray-500 text-sm">
                <p className="font-semibold">이 계산기는 아도나이x티비넷 고객을 위해 제작되었습니다.</p>
                <p className="font-semibold">무단 복제 및 타사의 사용을 금합니다.</p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-400 mb-2">
                 총 요금: - 원
              </div>
              <div className="text-xl font-semibold text-gray-400">
                 부가세포함: - 원
              </div>
            </div>
          )}
          
          {!isCalculated && (
            <p className="text-gray-500 text-sm">
              TV 수량과 옵션을 선택한 후 계산하기 버튼을 눌러주세요
            </p>
          )}
        </div>
        
        {/* 푸터 */}
        <footer className="text-center mt-6 text-sm text-gray-500 border-t pt-4">
          <p>© {new Date().getFullYear()} 아도나이x티비넷. All rights reserved.</p>
          <p>공식 블로그: <a href="https://blog.naver.com/no1_tvnet" className="text-blue-600 underline">https://blog.naver.com/no1_tvnet</a></p>
        </footer>
      </div>
    </div>
  );
}
