


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

        function sliderEffect(){ //슬라이드 효과 + 무한 루프
            currentIndex++; // 이미지 겟수

            $(".slider__inner").css({ 
                'transition': 'all 0.6s', 
                'transform': `translateX(-${sliderWidth * currentIndex}px)`
            });

            if(currentIndex == sliderCount){  //마지막 이미지
                setTimeout(() => {
                    $(".slider__inner").css({
                        'transition': '0s',
                        'transform': 'translateX(0px)'
                    });
                }, 700); //0.7초 후에 실행
                currentIndex = 0; // 1번째 이미지로 변경
            }
        };

        setInterval(sliderEffect, sliderInterval); //함수 호출