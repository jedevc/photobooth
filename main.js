window.addEventListener('load', () => {
	let booth = document.getElementById('booth')
	let video = document.getElementById('camera')
	let captureButton = document.getElementById('capture')

	let overlay = document.getElementById('overlay')

	let roll = document.getElementById('roll')

	let camera = new Camera(video)

	overlay.style.display = 'none'
	captureButton.addEventListener('click', () => {
		let thumb = document.createElement('img')
		thumb.src = camera.takePicture()
		thumb.style.height = '100%'

		overlay.addEventListener('animationend', () => {
			overlay.classList.remove('flash')
			overlay.style.display = 'none'

			roll.appendChild(thumb)
		})

		overlay.style.display = 'block'
		overlay.classList.add('flash')
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
