export const files = {
    'js': {
      name: 'js',
      language: 'javascript',
      value: `
/*
© Microsoft. All rights reserved.

This library is supported for use in Windows Tailored Apps only.

Build: 6.2.8100.0 
Version: 0.5 
*/

(function (global, undefined) {
"use strict";
undefinedVariable = {};
undefinedVariable.prop = 5;

function initializeProperties(target, members) {
    var keys = Object.keys(members);
    var properties;
    var i, len;
    for (i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        var enumerable = key.charCodeAt(0) !== /*_*/95;
        var member = members[key];
        if (member && typeof member === 'object') {
            if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
                if (member.enumerable === undefined) {
                    member.enumerable = enumerable;
                }
                properties = properties || {};
                properties[key] = member;
                continue;
            } 
        }
        if (!enumerable) {
            properties = properties || {};
            properties[key] = { value: member, enumerable: enumerable, configurable: true, writable: true }
            continue;
        }
        target[key] = member;
    }
    if (properties) {
        Object.defineProperties(target, properties);
    }
}

(function (rootNamespace) {

    // Create the rootNamespace in the global namespace
    if (!global[rootNamespace]) {
        global[rootNamespace] = Object.create(Object.prototype);
    }

    // Cache the rootNamespace we just created in a local variable
    var _rootNamespace = global[rootNamespace];
    if (!_rootNamespace.Namespace) {
        _rootNamespace.Namespace = Object.create(Object.prototype);
    }

    function defineWithParent(parentNamespace, name, members) {
        /// <summary locid="1">
        /// Defines a new namespace with the specified name, under the specified parent namespace.
        /// </summary>
        /// <param name="parentNamespace" type="Object" locid="2">
        /// The parent namespace which will contain the new namespace.
        /// </param>
        /// <param name="name" type="String" locid="3">
        /// Name of the new namespace.
        /// </param>
        /// <param name="members" type="Object" locid="4">
        /// Members in the new namespace.
        /// </param>
        /// <returns locid="5">
        /// The newly defined namespace.
        /// </returns>
        var currentNamespace = parentNamespace,
            namespaceFragments = name.split(".");

        for (var i = 0, len = namespaceFragments.length; i < len; i++) {
            var namespaceName = namespaceFragments[i];
            if (!currentNamespace[namespaceName]) {
                Object.defineProperty(currentNamespace, namespaceName, 
                    { value: {}, writable: false, enumerable: true, configurable: true }
                );
            }
            currentNamespace = currentNamespace[namespaceName];
        }

        if (members) {
            initializeProperties(currentNamespace, members);
        }

        return currentNamespace;
    }

    function define(name, members) {
        /// <summary locid="6">
        /// Defines a new namespace with the specified name.
        /// </summary>
        /// <param name="name" type="String" locid="7">
        /// Name of the namespace.  This could be a dot-separated nested name.
        /// </param>
        /// <param name="members" type="Object" locid="4">
        /// Members in the new namespace.
        /// </param>
        /// <returns locid="5">
        /// The newly defined namespace.
        /// </returns>
        return defineWithParent(global, name, members);
    }

    // Establish members of the "WinJS.Namespace" namespace
    Object.defineProperties(_rootNamespace.Namespace, {

        defineWithParent: { value: defineWithParent, writable: true, enumerable: true },

        define: { value: define, writable: true, enumerable: true }

    });

})("WinJS");

(function (WinJS) {

    function define(constructor, instanceMembers, staticMembers) {
        /// <summary locid="8">
        /// Defines a class using the given constructor and with the specified instance members.
        /// </summary>
        /// <param name="constructor" type="Function" locid="9">
        /// A constructor function that will be used to instantiate this class.
        /// </param>
        /// <param name="instanceMembers" type="Object" locid="10">
        /// The set of instance fields, properties and methods to be made available on the class.
        /// </param>
        /// <param name="staticMembers" type="Object" locid="11">
        /// The set of static fields, properties and methods to be made available on the class.
        /// </param>
        /// <returns type="Function" locid="12">
        /// The newly defined class.
        /// </returns>
        constructor = constructor || function () { };
        if (instanceMembers) {
            initializeProperties(constructor.prototype, instanceMembers);
        }
        if (staticMembers) {
            initializeProperties(constructor, staticMembers);
        }
        return constructor;
    }

    function derive(baseClass, constructor, instanceMembers, staticMembers) {
        /// <summary locid="13">
        /// Uses prototypal inheritance to create a sub-class based on the supplied baseClass parameter.
        /// </summary>
        /// <param name="baseClass" type="Function" locid="14">
        /// The class to inherit from.
        /// </param>
        /// <param name="constructor" type="Function" locid="9">
        /// A constructor function that will be used to instantiate this class.
        /// </param>
        /// <param name="instanceMembers" type="Object" locid="10">
        /// The set of instance fields, properties and methods to be made available on the class.
        /// </param>
        /// <param name="staticMembers" type="Object" locid="11">
        /// The set of static fields, properties and methods to be made available on the class.
        /// </param>
        /// <returns type="Function" locid="12">
        /// The newly defined class.
        /// </returns>
        if (baseClass) {
            constructor = constructor || function () { };
            var basePrototype = baseClass.prototype;
            constructor.prototype = Object.create(basePrototype);
            Object.defineProperty(constructor.prototype, "_super", { value: basePrototype });
            Object.defineProperty(constructor.prototype, "constructor", { value: constructor });
            if (instanceMembers) {
                initializeProperties(constructor.prototype, instanceMembers);
            }
            if (staticMembers) {
                initializeProperties(constructor, staticMembers);
            }
            return constructor;
        } else {
            return define(constructor, instanceMembers, staticMembers);
        }
    }

    function mix(constructor) {
        /// <summary locid="15">
        /// Defines a class using the given constructor and the union of the set of instance members
        /// specified by all the mixin objects.  The mixin parameter list can be of variable length.
        /// </summary>
        /// <param name="constructor" locid="9">
        /// A constructor function that will be used to instantiate this class.
        /// </param>
        /// <returns locid="12">
        /// The newly defined class.
        /// </returns>
        constructor = constructor || function () { };
        var i, len;
        for (i = 0, len = arguments.length; i < len; i++) {
            initializeProperties(constructor.prototype, arguments[i]);
        }
        return constructor;
    }

    // Establish members of "WinJS.Class" namespace
    WinJS.Namespace.define("WinJS.Class", {
        define: define,
        derive: derive,
        mix: mix
    });

})(WinJS);

})(this);
      `,
    },
    'java': {
      name: 'java',
      language: 'java',
      value: `
/*
Basic Java example using FizzBuzz
*/

import java.util.Random;

public class Example {
public static void main (String[] args){
    // Generate a random number between 1-100. (See generateRandomNumber method.)
    int random = generateRandomNumber(100);

    // Output generated number.
    System.out.println("Generated number: " + random + "\n");

    // Loop between 1 and the number we just generated.
    for (int i=1; i<=random; i++){
        // If i is divisible by both 3 and 5, output "FizzBuzz".
        if (i % 3 == 0 && i % 5 == 0){
            System.out.println("FizzBuzz");
        }
        // If i is divisible by 3, output "Fizz"
        else if (i % 3 == 0){
            System.out.println("Fizz");
        }
        // If i is divisible by 5, output "Buzz".
        else if (i % 5 == 0){
            System.out.println("Buzz");
        }
        // If i is not divisible by either 3 or 5, output the number.
        else {
            System.out.println(i);
        }
    }
}

/**
     Generates a new random number between 0 and 100.
    @param bound The highest number that should be generated.
    @return An integer representing a randomly generated number between 0 and 100.
*/
private static int generateRandomNumber(int bound){
    // Create new Random generator object and generate the random number.
    Random randGen = new Random();
    int randomNum = randGen.nextInt(bound);

    // If the random number generated is zero, use recursion to regenerate the number until it is not zero.
    if (randomNum < 1){
        randomNum = generateRandomNumber(bound);
    }

    return randomNum;
}
}

      `,
    },
    'C++': {
      name: 'C++',
      language: 'cpp',
      value: `
#include "pch.h"
#include "Direct3DBase.h"

using namespace Microsoft::WRL;
using namespace Windows::UI::Core;
using namespace Windows::Foundation;

// Constructor.
Direct3DBase::Direct3DBase()
{
}

// Initialize the Direct3D resources required to run.
void Direct3DBase::Initialize(CoreWindow^ window)
{
    m_window = window;
    
    CreateDeviceResources();
    CreateWindowSizeDependentResources();
}

// These are the resources that depend on the device.
void Direct3DBase::CreateDeviceResources()
{
    // This flag adds support for surfaces with a different color channel ordering than the API default.
    // It is recommended usage, and is required for compatibility with Direct2D.
    UINT creationFlags = D3D11_CREATE_DEVICE_BGRA_SUPPORT;

#if defined(_DEBUG)
    // If the project is in a debug build, enable debugging via SDK Layers with this flag.
    creationFlags |= D3D11_CREATE_DEVICE_DEBUG;
#endif

    // This array defines the set of DirectX hardware feature levels this app will support.
    // Note the ordering should be preserved.
    // Don't forget to declare your application's minimum required feature level in its
    // description.  All applications are assumed to support 9.1 unless otherwise stated.
    D3D_FEATURE_LEVEL featureLevels[] = 
    {
        D3D_FEATURE_LEVEL_11_1,
        D3D_FEATURE_LEVEL_11_0,
        D3D_FEATURE_LEVEL_10_1,
        D3D_FEATURE_LEVEL_10_0,
        D3D_FEATURE_LEVEL_9_3,
        D3D_FEATURE_LEVEL_9_2,
        D3D_FEATURE_LEVEL_9_1
    };

    // Create the DX11 API device object, and get a corresponding context.
    ComPtr<ID3D11Device> device;
    ComPtr<ID3D11DeviceContext> context;
    DX::ThrowIfFailed(
        D3D11CreateDevice(
            nullptr,                    // specify null to use the default adapter
            D3D_DRIVER_TYPE_HARDWARE,
            nullptr,                    // leave as nullptr unless software device
            creationFlags,              // optionally set debug and Direct2D compatibility flags
            featureLevels,              // list of feature levels this app can support
            ARRAYSIZE(featureLevels),   // number of entries in above list
            D3D11_SDK_VERSION,          // always set this to D3D11_SDK_VERSION
            &device,                    // returns the Direct3D device created
            &m_featureLevel,            // returns feature level of device created
            &context                    // returns the device immediate context
            )
        );

    // Get the DirectX11.1 device by QI off the DirectX11 one.
    DX::ThrowIfFailed(
        device.As(&m_d3dDevice)
        );

    // And get the corresponding device context in the same way.
    DX::ThrowIfFailed(
        context.As(&m_d3dContext)
        );
}

// Allocate all memory resources that change on a window SizeChanged event.
void Direct3DBase::CreateWindowSizeDependentResources()
{ 
    // Store the window bounds so the next time we get a SizeChanged event we can
    // avoid rebuilding everything if the size is identical.
    m_windowBounds = m_window->Bounds;

    // If the swap chain already exists, resize it.
    if(m_swapChain != nullptr)
    {
        DX::ThrowIfFailed(
            m_swapChain->ResizeBuffers(2, 0, 0, DXGI_FORMAT_B8G8R8A8_UNORM, 0)
            );
    }
    // Otherwise, create a new one.
    else
    {
        // Create a descriptor for the swap chain.
        DXGI_SWAP_CHAIN_DESC1 swapChainDesc = {0};
        swapChainDesc.Width = 0;                                     // use automatic sizing
        swapChainDesc.Height = 0;
        swapChainDesc.Format = DXGI_FORMAT_B8G8R8A8_UNORM;           // this is the most common swapchain format
        swapChainDesc.Stereo = false; 
        swapChainDesc.SampleDesc.Count = 1;                          // don't use multi-sampling
        swapChainDesc.SampleDesc.Quality = 0;
        swapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
        swapChainDesc.BufferCount = 2;                               // use two buffers to enable flip effect
        swapChainDesc.Scaling = DXGI_SCALING_NONE;
        swapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL; // we recommend using this swap effect for all applications
        swapChainDesc.Flags = 0;

        // Once the desired swap chain description is configured, it must be created on the same adapter as our D3D Device

        // First, retrieve the underlying DXGI Device from the D3D Device
        ComPtr<IDXGIDevice1>  dxgiDevice;
        DX::ThrowIfFailed(
            m_d3dDevice.As(&dxgiDevice)
            );

        // Identify the physical adapter (GPU or card) this device is running on.
        ComPtr<IDXGIAdapter> dxgiAdapter;
        DX::ThrowIfFailed(
            dxgiDevice->GetAdapter(&dxgiAdapter)
            );

        // And obtain the factory object that created it.
        ComPtr<IDXGIFactory2> dxgiFactory;
        DX::ThrowIfFailed(
            dxgiAdapter->GetParent(
                __uuidof(IDXGIFactory2), 
                &dxgiFactory
                )
            );

        Windows::UI::Core::CoreWindow^ p = m_window.Get();

        // Create a swap chain for this window from the DXGI factory.
        DX::ThrowIfFailed(
            dxgiFactory->CreateSwapChainForCoreWindow(
                m_d3dDevice.Get(),
                reinterpret_cast<IUnknown*>(p),
                &swapChainDesc,
                nullptr,    // allow on all displays
                &m_swapChain
                )
            );
            
        // Ensure that DXGI does not queue more than one frame at a time. This both reduces 
        // latency and ensures that the application will only render after each VSync, minimizing 
        // power consumption.
        DX::ThrowIfFailed(
            dxgiDevice->SetMaximumFrameLatency(1)
            );
    }
    
    // Obtain the backbuffer for this window which will be the final 3D rendertarget.
    ComPtr<ID3D11Texture2D> backBuffer;
    DX::ThrowIfFailed(
        m_swapChain->GetBuffer(
            0,
            __uuidof(ID3D11Texture2D),
            &backBuffer
            )
        );

    // Create a view interface on the rendertarget to use on bind.
    DX::ThrowIfFailed(
        m_d3dDevice->CreateRenderTargetView(
            backBuffer.Get(),
            nullptr,
            &m_renderTargetView
            )
        );

    // Cache the rendertarget dimensions in our helper class for convenient use.
    D3D11_TEXTURE2D_DESC backBufferDesc;
    backBuffer->GetDesc(&backBufferDesc);
    m_renderTargetSize.Width  = static_cast<float>(backBufferDesc.Width);
    m_renderTargetSize.Height = static_cast<float>(backBufferDesc.Height);

    // Create a descriptor for the depth/stencil buffer.
    CD3D11_TEXTURE2D_DESC depthStencilDesc(
        DXGI_FORMAT_D24_UNORM_S8_UINT, 
        backBufferDesc.Width,
        backBufferDesc.Height,
        1,
        1,
        D3D11_BIND_DEPTH_STENCIL);

    // Allocate a 2-D surface as the depth/stencil buffer.
    ComPtr<ID3D11Texture2D> depthStencil;
    DX::ThrowIfFailed(
        m_d3dDevice->CreateTexture2D(
            &depthStencilDesc,
            nullptr,
            &depthStencil
            )
        );

    // Create a DepthStencil view on this surface to use on bind.
    DX::ThrowIfFailed(
        m_d3dDevice->CreateDepthStencilView(
            depthStencil.Get(),
            &CD3D11_DEPTH_STENCIL_VIEW_DESC(D3D11_DSV_DIMENSION_TEXTURE2D),
            &m_depthStencilView
            )
        );

    // Create a viewport descriptor of the full window size.
    CD3D11_VIEWPORT viewPort(
        0.0f,
        0.0f,
        static_cast<float>(backBufferDesc.Width),
        static_cast<float>(backBufferDesc.Height)
        );
        
    // Set the current viewport using the descriptor.
    m_d3dContext->RSSetViewports(1, &viewPort);
}

void Direct3DBase::UpdateForWindowSizeChange()
{
    if (m_window->Bounds.Width  != m_windowBounds.Width ||
        m_window->Bounds.Height != m_windowBounds.Height)
    {
        m_renderTargetView = nullptr;
        m_depthStencilView = nullptr;
        CreateWindowSizeDependentResources();
    }
}

void Direct3DBase::Present()
{
    // The first argument instructs DXGI to block until VSync, putting the application
    // to sleep until the next VSync. This ensures we don't waste any cycles rendering
    // frames that will never be displayed to the screen.
    HRESULT hr = m_swapChain->Present(1, 0);

    // If the device was removed either by a disconnect or a driver upgrade, we 
    // must completely reinitialize the renderer.
    if (hr == DXGI_ERROR_DEVICE_REMOVED || hr == DXGI_ERROR_DEVICE_RESET)
    {
        Initialize(m_window.Get());
    }
    else
    {
        DX::ThrowIfFailed(hr);
    }
}
      
      `,
    },
    'Python': {
      name: 'Python',
      language: 'python',
      value: `
import banana


class Monkey:
    # Bananas the monkey can eat.
    capacity = 10
    def eat(self, n):
        """Make the monkey eat n bananas!"""
        self.capacity -= n * banana.size

    def feeding_frenzy(self):
        self.eat(9.25)
        return "Yum yum"
      
  
      `,
    },
  };