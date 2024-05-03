import express from "express"
import cors from "cors"
import { v4 } from 'uuid'
import multer from "multer"
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process' // be careful. generally not done in production server

const port = 6300
const app = express()

// multer middleware
const storage = multer.diskStorage({
    destination: (req, file, f) => f(null, './uploads'),
    filename: (req, file, f) => f(null, file.fieldname + '-' + v4() + path.extname(file.originalname))
})

// multer config
const upload = multer({ storage })

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')//be careful
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => { })
app.post('/upload', upload.single('file'), (req, res) => {
    const lessonID = v4()
    const vidPath = req.file.path
    const outputPath = `./uploads/courses/${lessonID}`
    const hlsPath = `${outputPath}/index.m3u8`
    console.log(hlsPath)
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true })
    // ffmpeg
    const ffmpegCommand = `ffmpeg -i ${vidPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`
    // no queue because of Proof of Concept(POC), don't use in production
    exec(ffmpegCommand, (err, stdout, stderr) => {
        if (err) console.log('err', err)
        console.log('stdout', stdout)
        console.log('stderr', stderr)
        const vidUrl = `http:localhost:6300/uploads/courses/${lessonID}/index.m3u8`
        res.json({
            msg: 'Video converted to HLS format',
            vidUrl,
            lessonID
        })
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})