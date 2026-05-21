#!/bin/bash
# setup-gpu.sh - Run ONLY if your Hostinger VPS has NVIDIA GPU

set -e

echo "🔧 Setting up NVIDIA GPU support..."

# 1. Install NVIDIA drivers (Hostinger provides CUDA-ready images for KVM 4+)
if ! command -v nvidia-smi &> /dev/null; then
    echo "❌ NVIDIA drivers not detected. Contact Hostinger support for GPU-enabled VPS."
    exit 1
fi

# 2. Install NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# 3. Configure Docker for GPU access
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# 4. Verify GPU access
echo "🧪 Testing GPU access..."
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu24.04 nvidia-smi

# 5. Update .env.video
echo "✅ GPU setup complete. Update .env.video:"
echo "   GPU_ENABLED=true"
echo "   GPU_COUNT=1"

echo "🎉 Ready for GPU-accelerated video encoding!"
