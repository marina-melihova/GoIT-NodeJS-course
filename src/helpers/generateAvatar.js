const http = require('https');
const fs = require('fs');
const { promises: fsPromise } = fs;
const path = require('path');
const { AvatarGenerator } = require('random-avatar-generator');

const download = async (url, dest) => {
  const file = await fsPromise.createWriteStream(dest);
  const request = http
    .get(url, response => {
      response.pipe(file);
      file.on('finish', () =>
        file.close(() => console.log('A new avatar is downloaded')),
      );
    })
    .on('error', err => {
      await fsPromise.unlink(dest);
      console.log(`successfully deleted ${dest}`);
      console.log(err.message);
    });
};
const fileName = Date.now();
const destination = `tmp/${fileName}.svg`;
const fullPath = path.join(__dirname, `../../${destination}`);
const generator = new AvatarGenerator();
// const avatar = generator.generateRandomAvatar();
// download(avatar, fullPath);
module.exports = destination;
