# Start by making sure the `assemblyai` package is installed.
# If not, you can install it by running the following command:
# pip install -U assemblyai
#
# Note: Some macOS users may need to use `pip3` instead of `pip`.

import assemblyai as aai

# Replace with your API key
aai.settings.api_key = "05fd8e2de20e46eaab591c2142b76c79"

# URL of the file to transcribe
transcriber = aai.Transcriber()
# FILE_URL = "https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3"
transcript = transcriber.transcribe("./voice.mp3")
# You can also transcribe a local file by passing in a file path
## FILE_URL = './path/to/file.mp3'

# for the file url case:
##transcriber = aai.Transcriber()
## transcript = transcriber.transcribe(transcript)

if transcript.status == aai.TranscriptStatus.error:
    print(transcript.error)
else:
    print(transcript.text)
