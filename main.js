window.addEventListener('load', () => {
	let booth = document.getElementById('booth')
	let video = document.getElementById('camera')
	let captureButton = document.getElementById('capture')

	let showcase = document.getElementById('showcase')
	let screenshot = document.getElementById('screenshot')
	let returnButton = document.getElementById('return')

	let overlay = document.getElementById('overlay')

	let camera = new Camera(video)
	
	showcase.style.display = 'none'
	overlay.style.display = 'none'

	captureButton.addEventListener('click', () => {
		screenshot.src = camera.takePicture()

		overlay.addEventListener('animationend', () => {
			overlay.classList.remove('flash')
			overlay.style.display = 'none'
		})
		booth.style.display = 'none'
		showcase.style.display = 'block'

		overlay.style.display = 'block'
		overlay.classList.add('flash')

	})

	returnButton.addEventListener('click', () => {
		booth.style.display = 'block'
		showcase.style.display = 'none'
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
