var X = new Vue({
	el: '#app',
	data: {
		imgUrl: '',
		showDebris: true,
		num: 0,
		imgWidth: 0,
		imgHeight: 0,
		browserW: 0,
		browserH: 0,
		maxError: 10,
		success: false,
	},
	mounted() {
		this.num = Number(prompt("Blocks:"));
		this.browserW = document.documentElement.clientWidth;
		this.browserH = document.documentElement.clientHeight;
		let image = this.$refs.image;
		this.imgUrl = 'wtw.jpeg';
		image.src = 'wtw.jpeg';
		setTimeout(() => {
		this.imgWidth = image.naturalWidth;
		this.imgHeight = image.naturalHeight;
		this.$nextTick(() => {
		let debrisWidth = this.imgWidth / (Math.sqrt(this.num));
		let debrisHeight = this.imgHeight / (Math.sqrt(this.num));
		let arr = this.$refs.debris; 
		let index = 0;
		for (let i = 0, len = Math.sqrt(this.num); i < len; ++i)
			for (let j = 0; j < len; ++j) {
				arr[index].style.width = debrisWidth + 'px';
				arr[index].style.height = debrisHeight + 'px';
				arr[index].style.backgroundPosition = `${-debrisWidth * j}px ${-debrisHeight * i}px`;
				arr[index].style.backgroundSize = `${this.imgWidth}px ${this.imgHeight}px`;
				let randomX = Math.random() * (this.browserW - debrisWidth + 1);
				let randomY = Math.random() * (this.browserH - debrisHeight + 1);
				arr[index].style.left = randomX + 'px';
				arr[index].style.top = randomY + 'px';
				index++;
			}
		});
		}, 10);
	},
	methods: {
	move(e) {
		console.log(e);
		e = e || window.event;
		let target = e.targe || e.srcElement;
		let startX = e.clientX || e.touches[0].clientX;
		let startY = e.clientY || e.touches[0].clientY;
		let px = target.offsetLeft;
		let py = target.offsetTop;
		document.onmousemove = function(e) {
			e = e || window.event;
			let x = e.clientX - startX + px;
			let y = e.clientY - startY + py;
			target.style.left = `${x}px`;
			target.style.top = `${y}px`;
		};
		document.onmouseup = () => {
			document.onmousemove = null;
			document.onmouseup = null;
			this.judge();
		};
		document.ontouchmove = function(e) {
			e = e || window.event;
			let x = e.touches[0].clientX - startX + px;
			let y = e.touches[0].clientY - startY + py;
			target.style.left = `${x}px`;
			target.style.top = `${y}px`;
		};
		document.ontouchend = () => {
			document.ontouchmove = null;
			document.ontouchend = null;
			this.judge();
		};
	},
	judge() {
		let index = 0;
		let res = this.num;
		for (let i = 0, len = Math.sqrt(this.num); i < len; ++i)
			for (let j = 0; j < len; ++j) {
				let temp = this.judgePosition(i, j, index);
				if (!temp) return;
				index++;
			}
		if (this.success) {
			this.showDebris = false;
			let image = this.$refs.image;
			let arr = this.$refs.debris;
			image.style.left = arr[0].getBoundingClientRect().left + 'px';
			image.style.top = arr[0].getBoundingClientRect().top + 'px';
			setTimeout(() => {
			for (let i = 1; i >= 0; i -= 0.00001) {
				setTimeout(() => {
					document.getElementsByClassName("finish")[0].style.opacity = i;
				}, 0);
			}
			}, 1000);
			setTimeout(() => {
			document.getElementsByClassName("finish")[0].style.transform = "scale(3, 3)";
			this.imgUrl = 'sxy.jpg';
			image.src = 'sxy.jpg';
			image.style.left = 720 + 'px';
			image.style.top = 360 + 'px';
			for (let i = 0; i <= 1; i += 0.00001) {
				setTimeout(() => {
					document.getElementsByClassName("finish")[0].style.opacity = i;
				}, 0);
			}
			}, 2000);
		}
	},
	judgePosition(i, j, index) {
		let arr = this.$refs.debris;
		let len = Math.sqrt(this.num);
		let curDomRect = arr[index].getBoundingClientRect();
		let dis;
		if (j - 1 >= 0) {
			dis = Math.abs(curDomRect.left - arr[index - 1].getBoundingClientRect().right);
			if (dis > this.maxError) return false;
		}
		if (j + 1 < len) {
			dis = Math.abs(curDomRect.right - arr[index + 1].getBoundingClientRect().left);
			if (dis > this.maxError) return false;
		}
		if (i - 1 >= 0) {
			dis = Math.abs(curDomRect.top - arr[index - len].getBoundingClientRect().bottom);
			if (dis > this.maxError) return false;
		}
		if (i + 1 < len) {
			dis = Math.abs(curDomRect.bottom - arr[index + len].getBoundingClientRect().top);
			if (dis > this.maxError) return false;
		}
		this.success = true;
		return true;
	}
	}
});