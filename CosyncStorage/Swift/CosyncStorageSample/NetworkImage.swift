//
//  NetworkImage.swift
//  CosyncStorageSample
//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//
//  For questions about this license, you may write to mailto:info@cosync.io
//
//  Created by Richard Krueger on 12/20/20.
//  Copyright (C) 2020 Cosync. All rights reserved.
//

import SwiftUI
import Kingfisher
import UIKit


public struct NetworkImage: SwiftUI.View {

    // swiftlint:disable:next redundant_optional_initialization
    @State private var image: UIImage? = nil

    public let imageURL: URL?
    public let placeholderImage: UIImage
    public let animation: Animation = .default

    public var body: some SwiftUI.View {

    if let image = image {
            Image(uiImage: image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .transition(.opacity)
        } else {
            Image(uiImage: placeholderImage)
                .onAppear(perform: loadImage)
                .transition(.opacity)
        }
    }

    private func loadImage() {
        guard let imageURL = imageURL, image == nil else { return }
        KingfisherManager.shared.retrieveImage(with: imageURL) { result in
            switch result {
                case .success(let imageResult):
                    withAnimation(self.animation) {
                        self.image = imageResult.image
                    }
                case .failure:
                    break
            }
        }
    }
}
