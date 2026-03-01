# Use the official Rust image as a base
FROM rust:latest

# Install Trunk (the tool that builds Rust WebAssembly apps)
RUN cargo install trunk

# Install cargo-watch (for automatic reloading when code changes)
RUN cargo install cargo-watch

# 🔥 ADD THIS LINE: Install the WebAssembly target for Rust
RUN rustup target add wasm32-unknown-unknown

# Set the working directory inside the container
WORKDIR /app

# Expose port 8080 (the default port for web servers)
EXPOSE 8080
# Command to run when the container starts
CMD ["trunk", "serve", "--address", "0.0.0.0", "--port", "8080"]