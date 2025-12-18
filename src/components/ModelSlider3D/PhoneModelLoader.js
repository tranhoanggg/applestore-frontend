import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PhoneModelLoader = ({ url }) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    // --- CẤU HÌNH ---
    const targetScale = 32; // Kích thước đích
    const speed = 1; // Tốc độ bạn đã chọn (Scale)

    // Tốc độ xoay: Nên để bằng hoặc lớn hơn speed scale một chút để kịp xoay hết 2 vòng
    const rotationSpeed = 2;

    // 1. Hiệu ứng Scale (To dần từ 0 lên 32)
    modelRef.current.scale.x = THREE.MathUtils.lerp(
      modelRef.current.scale.x,
      targetScale,
      delta * speed
    );
    modelRef.current.scale.y = THREE.MathUtils.lerp(
      modelRef.current.scale.y,
      targetScale,
      delta * speed
    );
    modelRef.current.scale.z = THREE.MathUtils.lerp(
      modelRef.current.scale.z,
      targetScale,
      delta * speed
    );

    // 2. Hiệu ứng Xoay (Spin) 2 vòng
    // Đích đến là Math.PI (Vị trí chuẩn mặt sau/trước tùy model)
    const targetRotationY = Math.PI;

    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      delta * rotationSpeed
    );
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      // TRẠNG THÁI KHỞI TẠO:
      // - Scale = 0 (Vô hình)
      // - Rotation:
      //    Math.PI (đích)
      //    + (2 * 2 * Math.PI) -> Cộng thêm đúng 2 vòng quay (4 PI)
      //    Khi lerp chạy, nó sẽ "trả ngược" 2 vòng này về lại Math.PI
      scale={[0, 0, 0]}
      rotation={[0, Math.PI + 2 * 2 * Math.PI, 0]}
    />
  );
};

export default PhoneModelLoader;
