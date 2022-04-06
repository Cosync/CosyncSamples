//
//  AssetView.swift
//  CosyncStorage
//
//  Created by Tola Voeung on 24/3/22.
//

import SwiftUI
import CosyncStorageAPI
import AVKit


struct AssetView: View {
    
    
    @StateObject private var cosyncHelper = CosyncStorageAPI.shared
    
    @State private var showUpload = false
    
    var body: some View {
        NavigationView{
         
            VStack{
                List{
                    ForEach(cosyncHelper.allAssets, id: \.self){ asset in
                        HStack{
                            
                            if(asset.contentType!.contains("image")){
                                
                                AsyncImage(url: URL(string: asset.urlMedium!), transaction: .init(animation: .spring(response: 1.6))) { phase in
                                            switch phase {
                                            case .empty:
                                                ProgressView()
                                                    .progressViewStyle(.circular)
                                            case .success(let image):
                                                image
                                                    .resizable()
                                                    .aspectRatio(contentMode: .fill)
                                            case .failure:
                                                Text("Failed fetching image. ")
                                                    .foregroundColor(.red)
                                                
                                                //if(asset.expirationHours > 0){
                                                   Button(action: {
                                                       Task{
                                                           let _ = await CosyncStorageAPI.shared.refreshAsset(assetId: "\(asset._id)")
                                                       }
                                                       
                                                      // ProgressView().progressViewStyle(.circular)
           
                                                   }) {
                                                       Text("Refresh").padding()
                                                       Image(systemName: "arrow.clockwise.circle")
                                                   }
                                                   .padding()
                                                //}
                                                
                                            @unknown default:
                                                Text("Unknown error. Please try again.")
                                                    .foregroundColor(.red)
                                            }
                                        }
                                        .frame(width: 128, height: 128)
                                        .clipShape(RoundedRectangle(cornerRadius: 25))
                                
                            }
                            else{
                                if let url = asset.url {
                                    
                                    VideoPlayer(player: AVPlayer(url:  URL(string: url)!))
                                    .id("\(asset._id)")
                                    .padding()
                                    .frame(width: 200, height: 200, alignment: .center)

                                }
                                else {
                                    Image.init(uiImage: UIImage(systemName: "bookmark")!)
                                        .padding()
                                }
                            }
                            
                            
                        }
                    }
                }
                
                Spacer()
                
            }
            .navigationBarTitle("Assets")
            .navigationBarItems(
                trailing:
                    NavigationLink(destination: UploadView()) {
                        Image(systemName: "square.and.arrow.up.fill")
                    }
            )
        }
        
        
    }
     
}

struct AssetView_Previews: PreviewProvider {
    static var previews: some View {
        AssetView()
    }
}
