export interface Trait {
    trait_type: string;
    value: string | number;
    display_type?: string | null;
    max_value?: string | null;
    trait_count: number;
    order?: string | null;
  }
  
export interface NFT {
    'token_id': string;
    'image_original_url': string;
    'name': string;
    'description': string;
    'asset_contract.address': string;
    'asset_contract.created_date': string;
    'asset_contract.name': string;
    'asset_contract.nft_version': string;
    'asset_contract.opensea_version': string;
    'asset_contract.owner': string;
    'asset_contract.schema_name': string;
    'asset_contract.symbol': string;
    'asset_contract.total_supply': string;
    'asset_contract.description': string;
    'asset_contract.external_link': string;
    'asset_contract.image_url': string;
    'asset_contract.default_to_fiat': boolean;
    'asset_contract.dev_buyer_fee_basis_points': string;
    'asset_contract.dev_seller_fee_basis_points': string;
    'asset_contract.only_proxied_transfers': boolean;
    'asset_contract.opensea_buyer_fee_basis_points': string;
    'asset_contract.opensea_seller_fee_basis_points': string;
    'asset_contract.buyer_fee_basis_points': string;
    'asset_contract.seller_fee_basis_points': string;
    'asset_contract.payout_address': string;
    'image_url': string;
    'image_preview_url': string;
    'image_thumbnail_url': string;
    'is_presale': boolean;
    'listing_date': string | null;
    'token_metadata': string;
    'traits': Trait[];
    'id': string;
    'background': string;
    'body': string;
    'face': string;
    'hair': string;
    'gender': string;
    'type': string;
    'badge1'?: string;
    'badge2'?: string;
    'badge3'?: string;
    'badge4'?: string;
    'badge5'?: string;
    'rarityScore'?: number;
} 