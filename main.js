window.addEventListener('load', () => {
	let booth = document.getElementById('booth')
	let video = document.getElementById('camera')
	let captureButton = document.getElementById('capture')

	let overlay = document.getElementById('overlay')

	let roll = document.getElementById('roll')

	let camera = new Camera(video)

	let count = 1

	overlay.style.display = 'none'
	captureButton.addEventListener('click', () => {
		let img = document.createElement('img')
		img.src = camera.takePicture()

		let thumb = document.createElement('a')
		thumb.classList.add('thumbnail')
		thumb.href = img.src 
		thumb.download = `webcam${count}.png`
		thumb.appendChild(img)

		count++

		overlay.addEventListener('animationend', () => {
			overlay.classList.remove('flash')
			overlay.style.display = 'none'

			roll.appendChild(thumb)
			roll.scrollLeft = img.x
		}, {once: true})

		overlay.style.display = 'block'
		overlay.classList.add('flash')
	})

	// keep focus on camera roll to allow keyboard scrolling
	roll.focus()
	roll.addEventListener('blur', () => {
		roll.focus()
	})
})

class Camera {
	constructor(video=null) {
		this.video = video
		if (this.video == null) {
			this.video = document.createElement('video')
		}

		const constraints = {video: true}
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			this.video.srcObject = stream
			this.video.play()
		}).catch((err) => {
			console.error(err.name, ':', err.message)
		})
	}

	takePicture() {
		let canvas = document.createElement('canvas')
		let context = canvas.getContext('2d')
		canvas.width = this.video.videoWidth
		canvas.height = this.video.videoHeight

		context.drawImage(this.video, 0, 0)

		return canvas.toDataURL()
	}
}
