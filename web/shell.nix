{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/162ee4189cf5.tar.gz") {} }:
  pkgs.mkShell {
    buildInputs = [
      pkgs.deno
    ];

    # Faster compilation time if available
    LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
  }