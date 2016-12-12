# Prepare System Resources

If you do not have enough memory, you need to either increase it or create swap.
For example, if you have t2.micro which has only 1GB RAM, you need to add 2GB swap.
Checkout this guide on how to add swap to Ubuntu:
https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04

# Install git if it not already present

# Add an SSH Key or create a new one to clone the project

# Install Python
You must have a "python" command available, or youtube-dl won't work.

# Install youtube-dl

sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl

# Install FFMPEG

sudo apt-get install ffmpeg

# Install Node.js

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
command -v nvm
nvm install node
nvm alias default node

# Install Packages

cd {project directory}

npm install
