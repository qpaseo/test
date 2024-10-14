// 페이지 로드 시 자동으로 팝업 창 열기
window.onload = function() {
    openPopup();
}

// 팝업 창 열기 함수
function openPopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'block';
}

// 팝업 창 닫기 함수
function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
}

const sliderWrap = document.querySelector(".slider__wrap");
        const sliderImg = sliderWrap.querySelector(".slider__img");             // 보여지는 영역
        const sliderInner = sliderWrap.querySelector(".slider__inner");         // 움직이는 영역
        const slider = sliderWrap.querySelectorAll(".slider");                  // 갯수 새기

        let currentIndex = 0;                                                   // 현재 보이는 이미지
        let sliderCount = 7;                                                    // 이미지 갯수
        let sliderInterval = 2000;                                              // 이미지 변경 간격 시간
        let sliderWidth = slider[0].clientWidth;                                // 이미지 가로값 구하기
        let sliderClone = sliderInner.firstElementChild.cloneNode(true);        



        sliderInner.append(sliderClone);

        function sliderEffect(){
            currentIndex++;

            $(".slider__inner").css({
                'transition': 'all 0.6s',
                'transform': `translateX(-${sliderWidth * currentIndex}px)`
            });

            if(currentIndex == sliderCount){
                setTimeout(() => {
                    $(".slider__inner").css({
                        'transition': '0s',
                        'transform': 'translateX(0px)'
                    });
                }, 700);
                currentIndex = 0;
            }
        };

        setInterval(sliderEffect, sliderInterval);