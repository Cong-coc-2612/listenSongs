const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);


// 1.render song => done
// 2.scroll top => done
// 3.play/pause/seek => done
// 4.cd rotate => done
// 5.next/prev =>done
// 6.random => done
// 7.next/repeat when end => done
// 8.active song
// 9.scroll active song into view
// 10.play song when click
const player = $('.player')
const playlist = $('.playlist')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

const app = {
    songs: [],
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,

    getFileJson: async function() {
        var response = await fetch("http://localhost:3000/songs")
        var data = await response.json()
        this.songs = data.songs
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    scrollToActive: function() {
        $$('.song')[this.currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    },
    random: function() {
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.curentIndex === this.currentIndex)
        this.loadCurrentSong()
        this.render()
        audio.play()
    },
    active: function() {
        $$('.song')[this.currentIndex].classList.add('active')
    },
    handleEvents: function() {
        const _this = this
            // Xử lí khi scrollTop
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        }

        // Xử lí bấm bút play
        playBtn.onclick = function() {
            _this.isPlaying ? audio.pause() : audio.play()
        }

        // Xử lý khi  playing Song
        audio.onplay = function() {
            _this.isPlaying = true
            audio.play()
            player.classList.add('playing')
            _this.active()
            _this.scrollToActive()
        }

        // Xử lý khi pause
        audio.onpause = function() {
            _this.isPlaying = false
            audio.pause()
            player.classList.remove('playing')
        }

        // Xử lý khi bấm nút nextSong
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.random()
            } else {
                _this.currentIndex++
                    if (_this.currentIndex >= _this.songs.length) {
                        _this.currentIndex = 0
                    }
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }

        // Xử lí khi bấm nút prevSong
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.random()
            } else {
                _this.currentIndex--
                    if (_this.currentIndex < 0) {
                        _this.currentIndex = _this.songs.length - 1
                    }
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }

        // Xử lí khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            progress.value = (audio.currentTime / audio.duration) * 100
        }

        // Xử lí khi tua bài
        progress.onchange = function() {
            const progressPercent = progress.value
            const songDuration = audio.duration
            const currentTime = songDuration * progressPercent / 100
            audio.currentTime = currentTime
        }

        //xử lí khi endSong
        audio.onended = function() {
            if (_this.isRepeat) {
                _this.loadCurrentSong()
                audio.play()
            } else if (_this.isRandom) {
                _this.random()
            } else {
                nextBtn.click()
            }
        }

        // Xử lí khi ấn repeatBtn
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.isRepeat ? repeatBtn.classList.add('active') : repeatBtn.classList.remove('active')
        }

        // Xử lí khi ấn randomBtn 
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.isRandom ? randomBtn.classList.add('active') : randomBtn.classList.remove('active')
        }

        // xử lí activeSong
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            console.log(songNode)
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data'))
                    _this.loadCurrentSong()
                    _this.scrollToActive()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    render: function() {
        let htmls = app.songs.map(function(song, index) {
            return `
        <div class="song ${index===this.currentIndex? 'active':''}" data="${index}" >
            <div class="${song.image}" style="background-image: url('${song.path}')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        playlist.innerHTML = htmls.join('')
    },
    start: async function() {
        await this.getFileJson()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        audio.play()
    }
}

app.start()