import json, struct

with open('public/h.glb', 'rb') as f:
    data = f.read()




chunk_len, _ = struct.unpack('<II', data[12:20])
gltf = json.loads(data[20:20+chunk_len])
accessors = gltf['accessors']
meshes = gltf.get('meshes', [])
nodes = gltf.get('nodes', [])

for n_idx, node in enumerate(nodes):
    name = node.get('name', '')
    if any(k in name.lower() for k in ['stair', 'riser', 'nosing', 'tread', 'ramp']):
        mesh_idx = node.get('mesh')
        if mesh_idx is not None:
            m = meshes[mesh_idx]
            for p in m.get('primitives', []):
                acc_idx = p.get('attributes', {}).get('POSITION')
                if acc_idx is not None:
                    acc = accessors[acc_idx]
                    min_v = acc.get('min', [0,0,0])
                    max_v = acc.get('max', [0,0,0])
                    trans = node.get('translation', [0,0,0])
                    w_min = [min_v[i] + trans[i] for i in range(3)]
                    w_max = [max_v[i] + trans[i] for i in range(3)]
                    print(f'{n_idx}: "{name}" Y:[{w_min[1]:.2f}, {w_max[1]:.2f}] X:[{w_min[0]:.2f}, {w_max[0]:.2f}] Z:[{w_min[2]:.2f}, {w_max[2]:.2f}]')
