import ffmpeg

input_file = 'sample.webm'
output_file = 'output.mp3'

def convert_webm_to_mp3(input_file, output_file):
    ffmpeg.input(input_file).output(output_file).run()

convert_webm_to_mp3(input_file, output_file)