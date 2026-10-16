"""
Processador Automático de Vídeos 3D VR para o Espaço Iris
---------------------------------------------------------
Uso:
    python scripts/process_video.py img/videos/novo_cabelo.mp4 [total_frames]

Exemplo:
    python scripts/process_video.py img/videos/cabelo_2.mp4 72
"""

import sys
import os
import imageio.v3 as iio
from PIL import Image

def process_video(video_path, total_frames=72, out_width=720, out_height=1280):
    if not os.path.exists(video_path):
        print(f"[ERRO] Arquivo de vídeo não encontrado: {video_path}")
        return False

    base_name = os.path.splitext(os.path.basename(video_path))[0]
    out_dir_name = f"{base_name}_frames"
    
    # Define diretórios de saída (tanto na pasta atual quanto na pasta aninhada se houver)
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dirs = [
        os.path.join(root_dir, "img", "videos", out_dir_name),
        os.path.join(root_dir, "espe-o_iris-main", "img", "videos", out_dir_name)
    ]

    for d in out_dirs:
        os.makedirs(d, exist_ok=True)

    print(f"-> Analisando vídeo: {video_path}")
    meta = iio.immeta(video_path)
    fps = meta.get("fps", 24)
    duration = meta.get("duration", 0)
    print(f"   Duração: {duration:.2f}s | FPS: {fps}")

    # Coleta os frames totais
    print(f"-> Carregando e selecionando {total_frames} quadros distribuídos...")
    all_frames = []
    for frame in iio.imiter(video_path):
        all_frames.append(frame)

    n_source = len(all_frames)
    if n_source == 0:
        print("[ERRO] Nenhum quadro pôde ser lido do vídeo.")
        return False

    print(f"   Total de quadros brutos lidos: {n_source}")

    step = (n_source - 1) / (total_frames - 1) if total_frames > 1 else 1
    indices = [int(round(i * step)) for i in range(total_frames)]

    print(f"-> Convertendo e salvando {total_frames} quadros em formato WebP otimizado (720x1280)...")
    for i, idx in enumerate(indices):
        frame = all_frames[idx]
        im = Image.fromarray(frame)
        im_resized = im.resize((out_width, out_height), Image.LANCZOS)
        
        fname = f"frame_{i+1:03d}.webp"
        for d in out_dirs:
            if os.path.exists(os.path.dirname(d)):
                im_resized.save(os.path.join(d, fname), "WEBP", quality=88)

    print(f"\n[SUCESSO] Processamento concluído com êxito!")
    print(f"-> Diretório gerado: img/videos/{out_dir_name}/")
    print(f"-> Total de frames gerados: {total_frames}")
    print(f"\nPara registrar este novo modelo no site, basta adicionar no array 'vitrineModels' em js/script.js:")
    print(f"""
    {{
      id: '{base_name}',
      title: 'Nome do Novo Cabelo',
      badge: 'Modelo {base_name}',
      basePath: 'img/videos/{out_dir_name}/frame_',
      totalFrames: {total_frames},
      ext: '.webp'
    }},
    """)
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python scripts/process_video.py <caminho_do_video> [total_frames]")
        sys.exit(1)

    v_path = sys.argv[1]
    n_frames = int(sys.argv[2]) if len(sys.argv) > 2 else 72
    process_video(v_path, total_frames=n_frames)
