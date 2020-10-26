const http = require('https');
const fs = require('fs');
const { promises: fsPromise } = fs;
const path = require('path');
const stream = require('stream');
const { Readable } = stream;
const { promisify } = require('util');
const finished = promisify(stream.finished);
const multer = require('multer');
const Jimp = require('jimp');
const { AvatarGenerator } = require('random-avatar-generator');
const generator = new AvatarGenerator();

const generateAvatar = async () => {
  const fileName = Date.now() + '.svg';
  const file = fs.createWriteStream(`./tmp/${fileName}`);
  const avatarUrl = generator.generateRandomAvatar();
  http.get(avatarUrl, async response => {
    const readable = Readable.from(response);
    readable.pipe(file);
    await finished(file);
    file.close(() => console.log('A new avatar is downloaded'));
  });
  return fileName;
};

const handleAvatar = async avatar => {
  const { ext } = path.parse(avatar);
  if (ext === '.jpg' || ext === '.png') {
    const imageCompress = await Jimp.read(
      path.join(__dirname + `../../../tmp/${avatar}`),
    );
    await imageCompress.quality(80);
  }
  // const fileName = Date.now() + ext;
  await fsPromise.rename(`./tmp/${avatar}`, `./public/images/${avatar}`);
  // return fileName;
};

const storage = multer.diskStorage({
  destination: './tmp',
  filename: (req, file, callback) => {
    const { ext } = path.parse(file.originalname);
    callback(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

module.exports = { upload, generateAvatar, handleAvatar };
