import ffmpeg

def convert_webm_to_mp3(input_file, output_file):
    # Input file path
    input_path = input_file

    # Output file path
    output_path = output_file

    # Input stream
    input_stream = ffmpeg.input(input_path)

    # Output stream
    output_stream = ffmpeg.output(input_stream, output_path)

    # Run ffmpeg command to convert
    ffmpeg.run(output_stream)

# Example usage
input_file = "input.webm"
output_file = "output.mp3"
convert_webm_to_mp3(input_file, output_file)
