# Use the official Node.js image as the base
FROM amd64/node:23-slim

# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     ca-certificates \
#     curl \
#     procps

ENV PRODUCTION=true

# Set the working directory inside the container
WORKDIR /usr/src/app

# create source and execution directories
RUN mkdir -p source-files && \
    mkdir -p execution-files

# Copy the application code to source-files
COPY . ./source-files

# Build the application
RUN cd source-files && \
    npm install && \
    npm run build

# move the build output to execution-files
RUN cp -r source-files/build/* execution-files/ && \
    ls -la execution-files

# clean up source-files
RUN rm -rf source-files

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "/usr/src/app/execution-files/lib/index.js"]
