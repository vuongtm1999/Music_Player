// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
let songDiv; // elment lam su kien Active
setTimeout(function () {
  songDiv = $$(".song");
}, 1000);

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  /* Neu co key PlAYER_STORAGE_KEY thi lay ve khong thi tra ve object */
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;

    // console.log(JSON.stringify(this.config))

    // console.log(this.config)
    
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Ben Tren Tang Lau",
      singer: "Tăng Duy Tân",
      path: "../source-music/BenTrenTangLau-TangDuyTan-7580542.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Ý Em Sao",
      singer: "Kay Trần, Lăng LD, Homie Boiz",
      path: "../source-music/YEmSao-KayTranLangLDHomieBoiz-5393919.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Mình Cưới Nhau Đi",
      singer: "Huỳnh James, Pjnboys",
      path: "../source-music/MinhCuoiNhauDi-HuynhJamesPjnboys-5382380.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Muốn Em Là",
      singer: "Keyo",
      path: "../source-music/MuonEmLa-KeyoVietNam-7198459.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Dam Cuoi Nha Remix",
      singer: "HongThanh - DJMie",
      path: "../source-music/DamCuoiNhaRemix-HongThanhDJMie-7211185.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Ngung lam ban",
      singer: "TINO HoangYenChibi",
      path: "../source-music/Ngunglamban-TINOFTKOPHoangYenChibi-4591046.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
    },
    {
      name: "Luu So Em Di",
      singer: "Huynh VanV u PhungTien",
      path: "../source-music/LuuSoEmDiDaiMeoRemix-HuynhVanVuPhungTien-7202629.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
              <div class="song ${index} ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
                <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body"
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
            `;
    });

    
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function (events) {
    //Xử lý phóng to thu nhỏ CD
    const _this = this;
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      //documentElement là thẻ HTML
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      // console.log(scrollTop)
      const newWidth = cdWidth - scrollTop;

      // console.log(newWidth)
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    /* Khi tạo ra đối tượng cbThumAnimate thì nó đã áp dụng animate vô cdThumnel nên phải pause() lại trước
    Play bài hát */
    cdThumbAnimate.pause();

    ///Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //Khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //Khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //Xu ly thanh progress cho song
    audio.ontimeupdate = function () {
      if (audio.duration) {
        // currentTime is Sets or returns the current playback position in the audio/video (in seconds)
        // duration is Returns the length of the current audio/video (in seconds)
        const proPressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );

        progress.value = proPressPercent;
        // console.log(audio.currentTime / audio.duration * 100)
      }
    };
    //Xu ly tua bai hat
    progress.onchange = function (e) {
      //Khó hiểu => Đã hiểu quy tắc tam suất
      // console.log(e.target.value)
      const seekTime = (e.target.value / 100) * audio.duration;

      audio.currentTime = seekTime;
    };
    //Xu ly btn next song
    nextBtn.onclick = function () {
      !_this.isRandom ? _this.nextSong() : _this.playRandomSong();
      audio.play();
      // console.dir(songDiv);

      //Render active song
      _this.renderActiveSong()

      _this.scrollToActiveSong();

      // _this.render(); render lại để active bài hát đang hát

      // if (isRandom) {
      //   playRandomSong();
      // } else {
      //   _this.nextSong();
      // }
    };
    //Xu ly btn prev song
    prevBtn.onclick = function () {
      !_this.isRandom ? _this.prevSong() : _this.playRandomSong();
      audio.play();

      _this.renderActiveSong()

      _this.scrollToActiveSong();

      // _this.render();render lại để active bài hát đang hát
    };

    //Xu ly btn random song
    randomBtn.onclick = function () {
      //Cách ngắn ngọn
      _this.isRandom = !_this.isRandom;
      this.classList.toggle("active", _this.isRandom);

      _this.setConfig("isRandom", _this.isRandom);
      // Cach tu nghi ra
      // if(!_this.isRandom)
      //   this.classList.add('active')
      // else
      //   this.classList.remove('active')

      //   _this.isRandom = !_this.isRandom
    };

    audio.volume = 0.2;

    //Xử lý sự kiện click btnRepeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      this.classList.toggle("active", _this.isRepeat);

      _this.setConfig("isRepeat", _this.isRepeat);
    };

    //Xử lý ended song
    audio.onended = function () {
      // console.log(_this.nextBtn);
      _this.isRepeat ? audio.play():  nextBtn.click();
    };

    //Xu ly khi click div bai hat 
    playlist.onclick = function (e) {
      /* e.target : tra ve element chinh xac khi Click vao thanh phan con cua class playlist */ 

      if(e.target.closest(".song")){
        // console.log(typeof Number(e.target.closest(".song").classList[1]))
        // _this.currentIndex = Number(e.target.closest(".song").classList[1])
        //Cach 2
        _this.currentIndex = Number(e.target.closest(".song").dataset.index)

        _this.loadCurrentSong()
        _this.renderActiveSong()
        audio.play()
      }
    }
  },
  loadConfig: function () {
    // console.log(this.config)

    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat

    console.log(this.isRandom, this.isRandom)
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth' , //Di chuyen xuong view tu tu con auto la nhay toi ngay
        block: 'end', // end thi khi xuong bai cuoi cung no active song se nhay len tren
        // inline: "nearest"
      })
    }, 300)
  },
  renderActiveSong: function () {
    //Them bo class Active
    songDiv.forEach((song) => {
      let isActive = song.classList.contains(this.currentIndex.toString());
      song.classList.toggle("active", isActive);
    });
  },
  playRandomSong: function () {
    // Xu ly trả về giá trị random cho bài hát
    // let newIndex;
    do {
      var newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex); //Khi newIndex = currentIndex thì re random

    this.currentIndex = newIndex;
    // console.log(this.currentIndex, newIndex);
    this.loadCurrentSong();
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }

    // console.log(_this.currentIndex)
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;

    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length;
    }

    // console.log(this.currentIndex, this.songs.length);
    this.loadCurrentSong();
  },
  start: function () {
    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();

    //Chua hieu
    /// Hiển thị trạng thái ban đầu của button repeat & random 
    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);

    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
