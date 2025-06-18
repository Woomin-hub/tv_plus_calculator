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
  const [result, setResult] = useState({ total: 0, withTax: 0, lineCount: 0, linePrice: 0, equipmentPrice: 0, settopPrice: 0 });
  const [provider, setProvider] = useState<ProviderType>('LGU+');
  const [settopType, setSettopType] = useState<SettopType>('UHD');
  const [internetType, setInternetType] = useState<InternetType>('500MB');
  
  const internetPrice = INTERNET_PRICES[provider][internetType];
  const providerSettopPrices = SETTOP_PRICES[provider];
  const unitSettopPrice = providerSettopPrices[settopType as keyof typeof providerSettopPrices];


  // 계산 로직
  const calculatePrice = () => {
    if (tvCount <= 0) return { total: 0, withTax: 0, lineCount: 0, linePrice: 0, equipmentPrice: 0, settopPrice: 0 };
    
    // 회선 수 = TV 수 / 8 (올림)
    const lineCount = Math.ceil(tvCount / 8);
    const linePrice = lineCount * INTERNET_PRICES[provider][internetType];
    
    // 채널 이용료
    const channelFee = tvCount * 5900; // tvG만 있음
    
    // 셋탑 임대료
    let settopPrice = 0;
    if (provider === 'LGU+' && settopType === 'UHD') {
      settopPrice = tvCount > 50 ? 0 : tvCount * unitSettopPrice;
    } else if (settopType === 'UHD') {
      settopPrice = tvCount * unitSettopPrice;
    // LGU+ UHD만 TV 수가 50개 넘으면 면제  
      
    } else if (settopType === 'HD') {
      settopPrice = 0; // 무료
    }
  
    
    const total = channelFee + settopPrice + linePrice;
    const withTax = Math.floor(total * 1.1);
    
    return { total, withTax, lineCount, linePrice, equipmentPrice: channelFee, settopPrice };
  };
  
  // 계산하기 버튼 클릭 핸들러
  const handleCalculate = () => {
    const calculatedResult = calculatePrice();
    setResult(calculatedResult);
    setIsCalculated(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">

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
        
        {/* 메인 폼 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
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
                  <div className="font-medium text-gray-800">기업 IPTV 일반형</div>
                  <div className="text-sm text-gray-600">TV 당 5,900원</div>
                  <span className="text-red-700 font-semibold">(KT는 채널 메인/추가 단말 수량이 어떻게 나눠지는지 확인 후 구성필요 & 메인/추가 여부에 따라 설치비도 다름. 이 부분도 확인 후 적용)</span>
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
          
           {/* 기본혜택 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              기본혜택
            </label>
            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base font-medium text-gray-800">
              <>
              와이파이 무상 제공<br />
              성인방송 비키 무상 제공<br />
              <span className="text-red-700 font-semibold">(통신사에 따라 기본 혜택이 다른지 확인 필요)</span>
              </>
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
                  <span>회선 수 (셋탑박스 8대당 1회선 과금)</span>
                  <span>{result.lineCount}회선</span>
                </div>
                <div className="flex justify-between">
                  <span>회선 요금 ({result.lineCount}회선 × {INTERNET_PRICES[provider][internetType].toLocaleString()}원)</span>
                  <span>{result.linePrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>채널 이용료 ({tvCount}개 × 5,900원)</span>
                  <span>{result.equipmentPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>셋탑 임대료 ({tvCount}개 × {result.settopPrice/tvCount}원)</span>
                  <span>{result.settopPrice.toLocaleString()}원</span>
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
                <p>티비넷 대표 박덕진 010-2700-9421 </p>
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
